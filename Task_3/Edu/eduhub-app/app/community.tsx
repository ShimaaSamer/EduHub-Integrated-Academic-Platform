import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useNavbar } from "./NavbarContext"; // تأكدي أن المسار صحيح لملف الـ Context

const { width } = Dimensions.get("window");

interface Community {
  id: number;
  name: string;
  lastMsg: string;
  icon: keyof typeof Ionicons.glyphMap;
  members: number;
  color: string;
}

export default function CommunityChatScreen() {
  const router = useRouter();
  const { setVisible } = useNavbar(); // استدعاء مفتاح التحكم في الـ Navbar
  const [selectedChat, setSelectedChat] = useState<Community | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const chats: Community[] = [
    { id: 1, name: "UI/UX Elite Hub", lastMsg: "Sara: Welcome guys 👋", icon: "color-palette-outline", members: 1250, color: "#FFD700" },
    { id: 2, name: "AI Research Students", lastMsg: "Omar: Any ML roadmap?", icon: "analytics-outline", members: 850, color: "#4CAF50" },
    { id: 3, name: "FullStack Developers", lastMsg: "You: React vs Vue ?", icon: "code-slash-outline", members: 2100, color: "#2196F3" },
  ];

  const [messages, setMessages] = useState([
    { id: 1, sender: "Sara", text: "Hello Everyone! 👋", type: "incoming", time: "10:30 AM" },
    { id: 2, sender: "Omar", text: "Hi! Welcome to eduhub community 💜", type: "incoming", time: "10:32 AM" },
    { id: 3, sender: "You", text: "Is anyone working on the final presentation?", type: "outgoing", time: "10:35 AM" },
  ]);

  // --- دوال التحكم في التنقل ---
  const handleSelectChat = (chat: Community) => {
    setLoading(true);
    setSelectedChat(chat);
    setVisible(false); // <--- إخفاء الـ Navbar فوراً عند الدخول للشات
    setTimeout(() => setLoading(false), 600);
  };

  const handleBack = () => {
    if (selectedChat) {
      setSelectedChat(null);
      setVisible(true); // <--- إظهار الـ Navbar فوراً عند العودة للقائمة
    } else {
      router.back();
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg = { id: Date.now(), sender: "You", text: message, type: "outgoing", time: "10:40 AM" };
    setMessages([...messages, newMsg]);
    setMessage("");
  };

  // --- عناصر الواجهة ---
  const renderChatItem = ({ item }: { item: Community }) => (
    <TouchableOpacity style={styles.chatPreview} onPress={() => handleSelectChat(item)}>
      <View style={[styles.avatar, { backgroundColor: item.color + "15" }]}>
        <Ionicons name={item.icon} size={26} color={item.color} />
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeaderRow}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.memberCount}><Ionicons name="people" size={10}/> {item.members}</Text>
        </View>
        <Text style={styles.chatMsg} numberOfLines={1}>{item.lastMsg}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: any) => (
    <View style={[styles.msgRow, item.type === "outgoing" && styles.msgOutgoing]}>
      <View style={[styles.msgBubble, item.type === "outgoing" ? styles.bubbleOut : styles.bubbleIn]}>
        {item.type === "incoming" && <Text style={styles.senderLabel}>{item.sender}</Text>}
        <Text style={[styles.msgText, item.type === "outgoing" && styles.textOut]}>{item.text}</Text>
        <Text style={[styles.msgTime, item.type === "outgoing" && { color: 'rgba(255,255,255,0.7)' }]}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={26} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>{selectedChat ? selectedChat.name : "Communities"}</Text>
            {selectedChat && <Text style={styles.onlineStatus}>Online Now</Text>}
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <Feather name={selectedChat ? "more-vertical" : "search"} size={22} color="#1E293B" />
        </TouchableOpacity>
      </View>

      {!selectedChat ? (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderChatItem}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={{ flex: 1 }}>
          {loading ? (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7477AF" />
            </View>
          ) : (
            <>
              <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMessage}
                contentContainerStyle={{ padding: 20, paddingBottom: 110 }}
                showsVerticalScrollIndicator={false}
              />

              {/* Input Area */}
              <View style={styles.inputAreaWrapper}>
                <View style={styles.inputContainer}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="happy-outline" size={24} color="#94A3B8" />
                  </TouchableOpacity>
                  
                  <TextInput
                    placeholder="Message..."
                    style={styles.textInput}
                    value={message}
                    onChangeText={setMessage}
                    placeholderTextColor="#94A3B8"
                    multiline
                  />

                  <TouchableOpacity style={styles.actionBtn}>
                    <Feather name="paperclip" size={20} color="#94A3B8" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.sendButton, !message.trim() && { backgroundColor: '#F1F5F9' }]} 
                    onPress={sendMessage}
                    disabled={!message.trim()}
                  >
                    <Ionicons 
                        name="send" 
                        size={18} 
                        color={message.trim() ? "#FFF" : "#CBD5E1"} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', 
    alignItems: 'center', justifyContent: 'space-between', 
    backgroundColor: '#FFF', paddingBottom: 15, 
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
  },
  headerIcon: { width: 40, height: 40, backgroundColor: '#F8FAFC', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  titleContainer: { alignItems: 'center', flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1A1C3D' },
  onlineStatus: { fontSize: 10, color: '#4CAF50', fontWeight: '600' },
  
  chatPreview: {
    flexDirection: "row", alignItems: 'center', padding: 16,
    backgroundColor: "#fff", borderRadius: 24, marginBottom: 12,
    shadowColor: "#7477AF", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 4
  },
  avatar: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  chatInfo: { flex: 1 },
  chatHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatName: { fontWeight: "800", color: '#1A1C3D', fontSize: 15 },
  memberCount: { fontSize: 10, color: '#94A3B8', fontWeight: '700' },
  chatMsg: { color: "#64748B", fontSize: 13, fontWeight: '500' },

  msgRow: { marginBottom: 18, maxWidth: '82%' },
  msgOutgoing: { alignSelf: "flex-end" },
  msgBubble: { padding: 14, borderRadius: 22, shadowColor: '#000', shadowOpacity: 0.02, elevation: 1 },
  bubbleIn: { backgroundColor: "#FFF", borderBottomLeftRadius: 4 },
  bubbleOut: { backgroundColor: "#7477AF", borderBottomRightRadius: 4 },
  senderLabel: { fontSize: 11, fontWeight: '800', color: '#7477AF', marginBottom: 4 },
  msgText: { fontSize: 14, color: '#1E293B', lineHeight: 20, fontWeight: '500' },
  textOut: { color: "#FFF" },
  msgTime: { fontSize: 9, color: '#94A3B8', marginTop: 6, textAlign: 'right' },

  inputAreaWrapper: {
    position: 'absolute', 
    bottom: 0, 
    width: '100%',
    backgroundColor: 'transparent', 
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  inputContainer: {
    flexDirection: "row", 
    alignItems: 'flex-end', 
    backgroundColor: '#FFF',
    borderRadius: 28, 
    paddingHorizontal: 8, 
    paddingVertical: 8,
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    shadowColor: '#7477AF', 
    shadowOpacity: 0.15, 
    shadowRadius: 20, 
    elevation: 12, 
  },
  actionBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  textInput: { 
    flex: 1, 
    marginHorizontal: 8, 
    fontSize: 15, 
    color: '#1E293B', 
    maxHeight: 120, 
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: '500'
  },
  sendButton: { 
    width: 42, 
    height: 42, 
    borderRadius: 21, 
    backgroundColor: "#7477AF", 
    justifyContent: "center", 
    alignItems: "center",
    marginLeft: 4
  },
});