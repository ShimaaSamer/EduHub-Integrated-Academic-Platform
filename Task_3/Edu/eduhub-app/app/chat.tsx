import React, { useState, useRef } from "react";
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, KeyboardAvoidingView, Platform, Dimensions, 
  Animated, TouchableWithoutFeedback, ScrollView, StatusBar,
  Modal
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ChatScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { id: "1", text: "Welcome to EduHub! How can I assist your learning today? ✨", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAttachVisible, setIsAttachVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const toggleHistory = () => {
    Animated.spring(slideAnim, {
      toValue: isHistoryOpen ? -width : 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
    setIsHistoryOpen(!isHistoryOpen);
  };

  const startNewSession = () => {
    setMessages([{ id: Date.now().toString(), text: "New Session Started! Ready for a fresh start? 🤖", sender: "bot" }]);
    if(isHistoryOpen) toggleHistory();
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        text: "Got it! I'm processing your request right now. 🧠💖", 
        sender: "bot" 
      }]);
    }, 1000);
  };

  const HistoryItem = ({ icon, title, color, type }: any) => (
    <TouchableOpacity style={styles.historyCard}>
      <View style={[styles.historyIconCircle, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={20} color="#FFF" />
      </View>
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.historyCardTitle}>{title}</Text>
        <Text style={styles.historyCardType}>{type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.sidebarInner}>
          <Text style={styles.sidebarLogo}>Edu<Text style={{color: '#7477AF'}}>Hub</Text></Text>

          <TouchableOpacity style={styles.newChatBtn} onPress={startNewSession}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.newChatText}>New Session</Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>RECENT ACTIVITIES</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <HistoryItem icon="book-open-page-variant" title="Atomic Habits" type="Book Summary" color="#FFB3B3" />
            <HistoryItem icon="comment-question" title="AI Ethics" type="Quiz" color="#B3CEFF" />
            <HistoryItem icon="cards-outline" title="Data Structures" type="Flashcards" color="#B3E5BE" />
            <HistoryItem icon="help-circle-outline" title="Quantum Physics" type="Question" color="#FFE0B3" />
          </ScrollView>
        </View>
      </Animated.View>

      {/* Attach Modal */}
      <Modal visible={isAttachVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setIsAttachVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.attachSheet}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Add Attachment</Text>

              <View style={styles.attachGrid}>
                {[
                  { name: "Image", icon: "image", color: "#FFB3B3" },
                  { name: "File", icon: "document-text", color: "#B3CEFF" },
                  { name: "Camera", icon: "camera", color: "#B3E5BE" },
                  { name: "Voice", icon: "mic", color: "#FFE0B3" }
                ].map((item, i) => (
                  <TouchableOpacity key={i} style={styles.attachItem} onPress={() => setIsAttachVisible(false)}>
                    <View style={[styles.attachIconCircle, { backgroundColor: item.color }]}>
                      <Ionicons name={item.icon as any} size={24} color="#FFF" />
                    </View>
                    <Text style={styles.attachLabel}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={28} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.botIconWrapper}>
            <MaterialCommunityIcons name="robot-happy-outline" size={20} color="#FFF" />
          </View>
          <Text style={styles.headerTitle}>EduBot</Text>
        </View>

        <TouchableOpacity onPress={toggleHistory} style={styles.headerBtn}>
          <Ionicons name="grid-outline" size={22} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isBot = item.sender === "bot";

            return (
              <View style={[styles.row, isBot ? styles.botRow : styles.userRow]}>
                {isBot && (
                  <View style={styles.avatarBot}>
                    <MaterialCommunityIcons name="robot-outline" size={18} color="#7477AF" />
                  </View>
                )}

                <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
                  <Text style={[styles.msgText, isBot ? styles.botText : styles.userText]}>
                    {item.text}
                  </Text>
                </View>

                {!isBot && (
                  <View style={styles.avatarUser}>
                    <MaterialCommunityIcons name="face-woman-profile" size={18} color="#7477AF" />
                  </View>
                )}
              </View>
            );
          }}
        />

        {/* INPUT AREA (🔴 التعديل هنا بس) */}
        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => setIsAttachVisible(true)} style={styles.attachmentBtn}>
              <Ionicons name="add" size={26} color="#7477AF" />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              placeholder="Ask EduBot something..."
              value={input}
              onChangeText={setInput}
              placeholderTextColor="#94A3B8"
            />

            <TouchableOpacity
              onPress={sendMessage}
              style={[
                styles.sendBtn,
                { backgroundColor: input.trim() ? '#7477AF' : '#F1F5F9' }
              ]}
            >
              <Ionicons name="send" size={18} color={input.trim() ? "#FFF" : "#CBD5E1"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },

  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    height: Platform.OS === 'ios' ? 100 : 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    backgroundColor: '#FFF'
  },

  headerCenter: { flexDirection: 'row', alignItems: 'center' },
  botIconWrapper: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#7477AF', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginLeft: 10 },
  headerBtn: { padding: 5 },

  sidebar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: width * 0.78, backgroundColor: '#FFF', zIndex: 1000, elevation: 15 },
  sidebarInner: { flex: 1, padding: 20, paddingTop: 50 },
  sidebarLogo: { fontSize: 26, fontWeight: '900', color: '#1E293B', marginBottom: 25 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#CBD5E1', letterSpacing: 1, marginBottom: 15, marginTop: 30 },

  newChatBtn: { backgroundColor: '#7477AF', padding: 14, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  newChatText: { color: '#FFF', fontWeight: '700', marginLeft: 8 },

  historyCard: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#FBFBFE', borderRadius: 16, marginBottom: 12 },
  historyIconCircle: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  historyCardTitle: { fontSize: 14, fontWeight: '700', color: '#334155' },
  historyCardType: { fontSize: 11, color: '#94A3B8' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(30,41,59,0.2)', justifyContent: 'flex-end' },
  attachSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 25, paddingBottom: 45 },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#F1F5F9', borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 25 },

  attachGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  attachItem: { alignItems: 'center', width: '22%' },
  attachIconCircle: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  attachLabel: { fontSize: 12, color: '#64748B' },

  listContent: { padding: 20, paddingBottom: 30 },

  row: { flexDirection: 'row', marginBottom: 22, alignItems: 'flex-end' },
  botRow: { justifyContent: 'flex-start' },
  userRow: { justifyContent: 'flex-end' },

  avatarBot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  avatarUser: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FDF2F8', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },

  bubble: { maxWidth: '78%', padding: 15, borderRadius: 22 },
  botBubble: { backgroundColor: '#F8FAFC', borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: '#7477AF', borderBottomRightRadius: 4 },

  msgText: { fontSize: 15, lineHeight: 22 },
  botText: { color: '#334155' },
  userText: { color: '#FFF' },

  /* 🔥 التعديل المهم هنا */
  inputArea: {
    padding: 15,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    backgroundColor: 'white',

    marginBottom: 12,   // ⬅️ رفع واضح فوق
    position: "relative",
    bottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 28,
    paddingHorizontal: 10,
    height: 54,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },

  textInput: { flex: 1, fontSize: 15, paddingHorizontal: 12, color: '#1E293B' },
  attachmentBtn: { padding: 8 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' }
});