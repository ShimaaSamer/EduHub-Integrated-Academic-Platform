import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useWishlist } from "./WishlistContext";

const { width } = Dimensions.get('window');

// تعريف نوع البيانات عشان TypeScript
interface Product {
  id: string;
  title: string;
  price: string;
  img: string;
}

export default function WishlistScreen() {
  const router = useRouter();
  const { wishlist, removeFromWishlist } = useWishlist();

  // تعديل الـ renderItem لحل مشكلة الـ item والـ index
  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.wishCard}>
      <Image 
        source={{ uri: item.img }} 
        style={styles.itemImg} 
        contentFit="cover" 
      />

      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>EGP {item.price}</Text>

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => removeFromWishlist(item.id)}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.cartBtn}>
        <MaterialCommunityIcons name="cart-plus" size={24} color="#7477AF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          wishlist.length === 0 && { flex: 1 }
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="heart-dislike-outline" size={80} color="#CBD5E1" />
            <Text style={styles.emptyText}>Your wishlist is empty!</Text>
            <TouchableOpacity 
              style={styles.shopBtn} 
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.shopBtnText}>Explore Products</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFBFF" },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingBottom: 20, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#2D2F56' },
  backBtn: { padding: 5 },
  listContent: { padding: 20, paddingBottom: 100 },
  wishCard: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 22, 
    padding: 12, 
    marginBottom: 15, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    alignItems: 'center' 
  },
  itemImg: { width: 85, height: 85, borderRadius: 18 },
  itemDetails: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  itemPrice: { fontSize: 14, color: '#7477AF', fontWeight: '600', marginTop: 4 },
  removeBtn: { marginTop: 8 },
  removeText: { color: '#F44336', fontSize: 12, fontWeight: '700' },
  cartBtn: { 
    width: 45, 
    height: 45, 
    backgroundColor: '#F1F5F9', 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 20, fontSize: 16, color: '#94A3B8', fontWeight: '600' },
  shopBtn: { 
    marginTop: 20, 
    backgroundColor: '#7477AF', 
    paddingHorizontal: 25, 
    paddingVertical: 12, 
    borderRadius: 15 
  },
  shopBtnText: { color: '#FFF', fontWeight: '700' }
});