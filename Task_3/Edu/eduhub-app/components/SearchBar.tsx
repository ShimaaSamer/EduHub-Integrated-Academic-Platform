import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';

export const SearchBar = () => (
  <View style={styles.searchSection}>
    <View style={styles.searchWrapper}>
      <View style={styles.searchInputContainer}>
        <Text>🔍</Text>
        <TextInput placeholder="Find books, tools..." style={styles.searchInputField} placeholderTextColor="#A0A0A0" />
        <Text style={{opacity: 0.3}}>🎙️</Text>
      </View>
      <TouchableOpacity style={styles.filterBtn}>
        <View style={styles.filterIconStyle}>
          <View style={[styles.filterLine, {width: 16}]} />
          <View style={[styles.filterLine, {width: 10}]} />
          <View style={[styles.filterLine, {width: 4}]} />
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  searchSection: { paddingHorizontal: 25, marginVertical: 15 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center' },
  searchInputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', height: 55, borderRadius: 18, paddingHorizontal: 15, elevation: 4, shadowColor: "#7477AF", shadowOpacity: 0.1 },
  searchInputField: { flex: 1, marginLeft: 10, fontSize: 14 },
  filterBtn: { backgroundColor: '#7477AF', width: 55, height: 55, borderRadius: 18, marginLeft: 12, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  filterIconStyle: { alignItems: 'flex-end' },
  filterLine: { height: 2, backgroundColor: '#FFF', borderRadius: 5, marginVertical: 1.5 },
});