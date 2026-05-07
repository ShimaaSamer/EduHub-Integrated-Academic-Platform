from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import uuid
# تأكدي من وجود المجلد image_processing وبداخله الملفات المطلوبة
from image_processing.image_io import load_image, save_image
from image_processing.quantization import quantize_color_image

app = Flask(__name__)
CORS(app) # للسماح لـ React بالاتصال بالسيرفر

# إعداد قاعدة البيانات
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///snap_poster.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# نموذج المستخدم (User Model)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# إنشاء قاعدة البيانات والجداول تلقائياً
with app.app_context():
    db.create_all()

# --- مسارات المصادقة (Authentication Routes) ---

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "User already exists"}), 409
    
    # تشفير كلمة السر قبل الحفظ لزيادة الأمان
    new_user = User(username=username, password=generate_password_hash(password))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Success"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data.get("username")).first()
    
    # التحقق من المستخدم وكلمة السر
    if user and check_password_hash(user.password, data.get("password")):
        # إرجاع اسم المستخدم ليتم عرضه في الـ Header بالـ Frontend
        return jsonify({"user": user.username}), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

# --- مسارات معالجة الصور (Image Processing) ---

UPLOAD_FOLDER = "static/uploads"
RESULT_FOLDER = "static/results"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

@app.route("/process", methods=["POST"])
def process_image():
    file = request.files.get("image")
    level = int(request.form.get("level", 8))
    
    if not file:
        return jsonify({"error": "No image provided"}), 400

    # توليد اسم فريد للملف لتجنب تكرار الأسماء
    unique_name = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    input_path = os.path.join(UPLOAD_FOLDER, unique_name)
    file.save(input_path)
    
    # معالجة الصورة
    img = load_image(input_path)
    poster = quantize_color_image(img, levels=level)
    
    output_filename = f"result_{unique_name}"
    output_path = os.path.join(RESULT_FOLDER, output_filename)
    save_image(poster, output_path)

    # إرجاع روابط الصور (تأكدي من استخدام المنفذ 5000)
    return jsonify({
        "uploaded_url": f"http://127.0.0.1:5000/{input_path.replace(os.sep, '/')}",
        "result_url": f"http://127.0.0.1:5000/{output_path.replace(os.sep, '/')}"
    })

# مسار لخدمة الملفات الثابتة (Static Files) لتظهر الصور في المتصفح
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

if __name__ == "__main__":
    app.run(debug=True, port=5000)