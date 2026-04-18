import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export const Header = () => (
  <View style={styles.header}>
    <View>
      <Text style={styles.welcomeText}>Welcome back,</Text>
      <Text style={styles.userName}>Shimaa Samer 👋</Text>
    </View>
    <TouchableOpacity style={styles.profileCircle}>
       <Image source={{ uri: 'https://i.pravatar.cc/150?u=shimaa' }} style={styles.avatarImg} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, paddingTop: 20, marginBottom: 10 },
  welcomeText: { color: "#AAA", fontSize: 13 },
  userName: { fontSize: 20, fontWeight: "700", color: "#2D2F56" },
  profileCircle: { width: 45, height: 45, borderRadius: 22.5, elevation: 5 },
  avatarImg: { width: '100%', height: '100%', borderRadius: 22.5 },
});