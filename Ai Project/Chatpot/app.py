import os
import io
import re
import json
import random
import itertools
import difflib
from flask import Flask, render_template, request, Response, stream_with_context, jsonify
from groq import Groq
import pdfplumber
from dotenv import load_dotenv
from PyPDF2 import PdfReader

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

load_dotenv(r"D:\fourth_year_2026\Final_Project\ai_features\Key_API.env")
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ══════════════════════════════════════════════════════════════════════════════
#  MINDMAP — Text Extraction & Utilities
# ══════════════════════════════════════════════════════════════════════════════

MODEL_STRONG = "llama-3.3-70b-versatile"
MODEL_FAST   = "llama-3.1-8b-instant"

def extract_text(file):
    text = ""
    try:
        if file.filename.endswith(".pdf"):
            reader = PdfReader(file)
            for page in reader.pages:
                content = page.extract_text()
                if content:
                    text += content + "\n"
        elif file.filename.endswith(".txt"):
            text = file.read().decode("utf-8")
        return text.strip()
    except Exception as e:
        print(f"Extraction Error: {e}")
        return ""

def clean_json(raw):
    for attempt in [
        lambda r: json.loads(r.strip()),
        lambda r: json.loads(re.sub(r"```(?:json)?|```", "", r).strip()),
    ]:
        try:
            return attempt(raw)
        except:
            pass
    cleaned = re.sub(r"```(?:json)?|```", "", raw).strip()
    try:
        start = cleaned.index("{")
        depth = 0
        for i, ch in enumerate(cleaned[start:], start):
            depth += (ch == "{") - (ch == "}")
            if depth == 0:
                return json.loads(cleaned[start:i+1])
    except Exception as e:
        print(f"Brace extraction failed: {e}")
    try:
        m = re.search(r'(\{[\s\S]*\})', cleaned)
        if m:
            return json.loads(m.group(1))
    except:
        pass
    return None

def groq_call(messages, model=MODEL_STRONG, max_tokens=8000):
    resp = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.05,
        max_tokens=max_tokens,
    )
    return resp.choices[0].message.content

SKELETON_PROMPT = """You are an academic mind-map generator.

Read the lecture text carefully and build a COMPLETE skeleton of the mind map.
Focus on identifying ALL main sections, sub-topics, and leaf-level concepts.

Return ONLY valid JSON — no markdown, no explanation:
{
  "name": "Lecture Title (عنوان المحاضرة)",
  "description": "Full overview of what this lecture covers.",
  "children": [
    {
      "name": "Section Title (عنوان القسم)",
      "description": "What this section is about.",
      "children": [
        {
          "name": "Concept (المفهوم)",
          "description": "placeholder",
          "children": []
        }
      ]
    }
  ]
}

Rules:
- 6–9 top-level branches.
- Each branch: 3–7 concept nodes.
- Each concept: 2–5 leaf nodes.
- Every name: English (Arabic translation).
- Output ONLY JSON."""

def build_skeleton(text):
    chunk = text[:10000]
    raw = groq_call([
        {"role": "system", "content": SKELETON_PROMPT},
        {"role": "user",   "content": f"Lecture:\n\n{chunk}"}
    ], model=MODEL_STRONG, max_tokens=5000)
    print(f"[PASS 1] preview: {raw[:200]}")
    return clean_json(raw)

ENRICH_PROMPT = """You are enriching one branch of an academic mind map with MAXIMUM detail.

You will receive:
1. The original lecture text.
2. A JSON branch node with placeholder descriptions.

Your job: replace EVERY "description" field with a RICH, DETAILED explanation extracted
from the lecture text. Follow these rules strictly:

- Definitions → copy near-verbatim from the text.
- Formulas & equations → preserve exactly, character by character.
- Numerical values, units, conditions → preserve exactly.
- Worked examples → include the full step-by-step in the description.
- Each description: 3–6 sentences minimum.
- Add missing children if the lecture text contains details not in the skeleton.
- Every name: English (Arabic translation) format.

Return ONLY the enriched JSON branch node — no markdown, no explanation."""

def enrich_branch(branch, lecture_text):
    branch_json = json.dumps(branch, ensure_ascii=False, indent=2)
    context = lecture_text[:12000]
    raw = groq_call([
        {"role": "system", "content": ENRICH_PROMPT},
        {"role": "user",   "content": (
            f"Lecture text:\n\n{context}\n\n"
            f"Branch to enrich:\n{branch_json}"
        )}
    ], model=MODEL_STRONG, max_tokens=4000)
    print(f"  [PASS 2] branch '{branch['name'][:30]}' preview: {raw[:150]}")
    enriched = clean_json(raw)
    return enriched if enriched else branch

# ══════════════════════════════════════════════════════════════════════════════
#  ROUTES — Main & Mindmap
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/")
def home():
    return render_template("main.html")

@app.route("/generate-map", methods=["POST"])
def generate_map():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    text = extract_text(file)
    if not text:
        return jsonify({"error": "File is empty or unreadable"}), 400

    print(f"[START] Total text: {len(text)} chars")
    print("[PASS 1] Building skeleton...")
    skeleton = build_skeleton(text)
    if not skeleton:
        return jsonify({"error": "Failed to build skeleton. Check server logs."}), 500

    skeleton.setdefault("name", "Lecture Map (خريطة المحاضرة)")
    skeleton.setdefault("children", [])

    print(f"[PASS 2] Enriching {len(skeleton['children'])} branches...")
    enriched_branches = []
    for i, branch in enumerate(skeleton["children"]):
        print(f"  Enriching branch {i+1}/{len(skeleton['children'])}: {branch['name'][:40]}")
        enriched = enrich_branch(branch, text)
        enriched_branches.append(enriched)

    skeleton["children"] = enriched_branches
    print("[DONE] Map ready.")
    return jsonify(skeleton)

# ══════════════════════════════════════════════════════════════════════════════
#  CHAT ROUTE  (NEW)
# ══════════════════════════════════════════════════════════════════════════════

CHAT_SYSTEM_PROMPT = """أنت مساعد تعليمي ذكي اسمه EduHub AI. تساعد الطلاب في:
- شرح المفاهيم الأكاديمية بوضوح وبساطة
- الإجابة على الأسئلة الدراسية
- تقديم نصائح للدراسة والمذاكرة
- مساعدة في حل المسائل والتمارين
- تلخيص المعلومات وتنظيمها

يمكنك الرد باللغة العربية أو الإنجليزية حسب لغة المستخدم.
كن ودوداً، واضحاً، وتعليمياً في ردودك."""

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        messages = data.get("messages", [])
        if not messages:
            return jsonify({"error": "No messages provided"}), 400

        # Build messages list with system prompt
        groq_messages = [{"role": "system", "content": CHAT_SYSTEM_PROMPT}]
        for msg in messages[-20:]:  # keep last 20 messages for context window
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role in ("user", "assistant") and content:
                groq_messages.append({"role": role, "content": content})

        resp = client.chat.completions.create(
            model=MODEL_STRONG,
            messages=groq_messages,
            temperature=0.6,
            max_tokens=1024,
        )
        reply = resp.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({"error": str(e)}), 500

# ══════════════════════════════════════════════════════════════════════════════
#  APP.PY ROUTES — Summary, Questions, Flashcards, Quiz
# ══════════════════════════════════════════════════════════════════════════════

def extract_text_apppy(file):
    text = ""
    try:
        file.stream.seek(0)
        if file.filename.lower().endswith(".pdf"):
            file_bytes = file.read()
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    content = page.extract_text()
                    if content:
                        text += content + "\n"
        elif file.filename.lower().endswith(".txt"):
            text = file.read().decode("utf-8")
        return text
    except Exception as e:
        print(f"Extraction Error (app.py): {e}")
        return ""

def split_text(text, chunk_size=8000):
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

def robust_parse(raw: str):
    text = re.sub(r'```[^\n]*\n?', '', raw)
    text = re.sub(r'\*\*+', '', text)
    parts = re.split(r'(?m)^\s*(?:Q\s*:|Question\s*\d+\s*:?|\d+[\.\)]\s*(?:Q:)?)\s*', text)
    mcq_list, tf_list = [], []
    for part in parts:
        part = part.strip()
        if not part or len(part) < 10: continue
        ans_match = re.search(r'Answer\s*[:\-]\s*([A-DTF][a-z]*)', part, re.IGNORECASE)
        if not ans_match: continue
        answer_raw = ans_match.group(1).strip().upper()
        q_text_match = re.search(r'(.*?)(?=\n\s*[A-D][\.\)]|\n\s*Answer:|\Z)', part, re.DOTALL | re.IGNORECASE)
        if not q_text_match: continue
        question = q_text_match.group(1).strip()
        options = {}
        for letter in ['A', 'B', 'C', 'D']:
            opt_match = re.search(rf'(?m)^\s*{letter}[\.\)]\s*(.+?)(?=\n\s*[A-D][\.\)]|\n\s*Answer:|\Z)', part, re.DOTALL | re.IGNORECASE)
            if opt_match:
                options[letter] = opt_match.group(1).strip()
        if 'TRUE' in answer_raw or 'FALSE' in answer_raw:
            final_ans = "True" if 'TRUE' in answer_raw else "False"
            tf_list.append({'q': question, 'answer': final_ans})
        elif len(options) >= 2:
            for l in ['A', 'B', 'C', 'D']:
                if l not in options: options[l] = "N/A"
            clean_ans = re.search(r'[A-D]', answer_raw)
            if clean_ans:
                mcq_list.append({'q': question, 'options': options, 'answer': clean_ans.group(0)})
    return mcq_list, tf_list

def string_dedup(items: list, key_fn, threshold=0.85):
    unique = []
    for item in items:
        sig = key_fn(item).lower()
        if not any(difflib.SequenceMatcher(None, sig, key_fn(u).lower()).ratio() > threshold for u in unique):
            unique.append(item)
    return unique

@app.route("/summarize", methods=["POST"])
def summarize():
    file = request.files.get("file")
    full_text = extract_text_apppy(file)
    if not full_text:
        return jsonify({"error": "Empty file"}), 400

    def generate_summary():
        chunks = split_text(full_text)
        intermediate_notes = ""
        yield f"data: {json.dumps({'status': f'Processing {len(chunks)} sections...'})}\n\n"
        for chunk in chunks:
            res = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "system", "content": "Summarize clearly, keeping technical terms."},
                          {"role": "user", "content": chunk}],
                temperature=0.2
            )
            intermediate_notes += res.choices[0].message.content + "\n"
        final_res = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": "Create a professional Study Guide with H1, H2, and Bullet points."},
                      {"role": "user", "content": f"Create final summary:\n{intermediate_notes}"}],
            temperature=0.3, stream=True
        )
        for chunk in final_res:
            content = chunk.choices[0].delta.content
            if content:
                yield f"data: {json.dumps({'summary_content': content})}\n\n"

    return Response(stream_with_context(generate_summary()), mimetype='text/event-stream')

@app.route("/generate-questions", methods=["POST"])
def generate_questions():
    file = request.files.get("file")
    full_text = extract_text_apppy(file)
    if not full_text:
        return jsonify({"error": "Empty file"}), 400

    def stream_questions():
        chunks = split_text(full_text, 6000)
        all_mcq, all_tf = [], []
        yield f"data: {json.dumps({'status': 'Extracting all possible questions...'})}\n\n"
        for chunk in chunks:
            res = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "system", "content": "Generate MCQ and T/F. Format: Q: [text] A) [opt] B) [opt] C) [opt] D) [opt] Answer: [Letter]. For T/F: Q: [text] Answer: [True/False]."},
                          {"role": "user", "content": chunk}],
                temperature=0.3
            )
            mcqs, tfs = robust_parse(res.choices[0].message.content)
            all_mcq.extend(mcqs)
            all_tf.extend(tfs)
        f_mcq = string_dedup(all_mcq, lambda x: x['q'])
        f_tf  = string_dedup(all_tf,  lambda x: x['q'])
        output = f"# 📝 Question Bank\n\n## Part I: MCQs ({len(f_mcq)})\n"
        for i, q in enumerate(f_mcq, 1):
            output += f"{i}. {q['q']}\n   - A) {q['options']['A']}\n   - B) {q['options']['B']}\n   - C) {q['options']['C']}\n   - D) {q['options']['D']}\n\n"
        output += f"## Part II: True / False ({len(f_tf)})\n"
        for i, q in enumerate(f_tf, 1):
            output += f"{i}. {q['q']}\n\n"
        output += "\n---\n### 🔑 Answer Key\n"
        output += "**MCQ:** " + ", ".join([f"{i+1}({q['answer']})" for i, q in enumerate(f_mcq)])
        output += "\n**T/F:** " + ", ".join([f"{i+1}({q['answer'][0]})" for i, q in enumerate(f_tf)])
        yield f"data: {json.dumps({'summary_content': output})}\n\n"

    return Response(stream_with_context(stream_questions()), mimetype='text/event-stream')

@app.route("/generate-flashcards", methods=["POST"])
def generate_flashcards():
    file = request.files.get("file")
    full_text = extract_text_apppy(file)

    def stream_response():
        chunks = list(split_text(full_text))
        for index, chunk in enumerate(chunks):
            try:
                prompt = f"""
                Analyze this part ({index + 1}/{len(chunks)}) of the document.
                Create high-quality educational flashcards.

                Rules:
                - Use the SAME language as the text.
                - Each card must follow this format:
                Flashcard [number]
                Q: [Question]
                A: [Answer]

                Text to analyze:
                {chunk}
                """
                response = client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.4
                )
                content = response.choices[0].message.content
                yield f"data: {json.dumps({'flashcards': content})}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return Response(stream_response(), mimetype='text/event-stream')

@app.route("/generate-quiz", methods=["POST"])
def generate_quiz():
    file = request.files.get("file")
    difficulty = request.form.get("difficulty", "Medium")
    full_text = extract_text_apppy(file)
    num_questions = 20

    def stream_quiz():
        chunks = split_text(full_text, 5000)
        random.shuffle(chunks)
        gen_count = 0
        cycle = itertools.cycle(chunks)
        for chunk in cycle:
            if gen_count >= num_questions: break
            needed = min(5, num_questions - gen_count)
            res = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": f"Generate {needed} MCQs. Difficulty: {difficulty}. Format: Q: [Question]\nA) [Opt]\nB) [Opt]\nC) [Opt]\nD) [Opt]\nCorrect: [Letter]\n---\nText: {chunk}"}],
                temperature=0.7
            )
            content = res.choices[0].message.content
            gen_count += content.count("Q:")
            yield f"data: {json.dumps({'quiz_data': content})}\n\n"

    return Response(stream_quiz(), mimetype='text/event-stream')

# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    app.run(debug=True, port=5002)