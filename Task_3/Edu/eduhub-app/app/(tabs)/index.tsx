import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions,
  FlatList, ScrollView, Platform
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useWishlist } from "../WishlistContext";

const { width } = Dimensions.get("window");

const slides = [
  { id: "1", title: "Engineering Tools", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800" },
  { id: "2", title: "Medical References", img: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800" },
];

const categories = [
  { id: "1", name: "Engineering", icon: "📐" },
  { id: "2", name: "Medical", icon: "🩺" },
  { id: "3", name: "Books", icon: "📚" },
  { id: "4", name: "Tools", icon: "🛠️" },
];

const studyItems = [
  { id: "101", title: "Calculus Book", status: "Available", color: "#4CAF50", price: "150.00", img: "https://images.unsplash.com/photo-1543004629-141a44569ee8?q=80&w=400" },
  { id: "102", title: "Lab Microscope", status: "New", color: "#7477AF", price: "2,400.00", img: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=400" },
  { id: "103", title: "T-Square Ruler", status: "Available", color: "#4CAF50", price: "85.00", img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=400" },
  { id: "104", title: "Stethoscope", status: "Borrowed", color: "#F44336", price: "320.00", img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=400" },
];

export default function Home() {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef<FlatList>(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (activeSlide + 1) % slides.length;
      setActiveSlide(nextIndex);
      sliderRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 4000);
    return () => clearInterval(interval);
  }, [activeSlide]);

  const renderItemCard = (item: any, isHorizontal = false) => {
    const isFav = isInWishlist(item.id);

    return (
      <TouchableOpacity 
        key={item.id} 
        style={[styles.premiumCard, isHorizontal && { width: 170, marginRight: 18 }]}
        onPress={() => router.push({
          pathname: "/BookDetails", 
          params: { ...item, image: item.img }
        })}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.img }} style={styles.cardImg} contentFit="cover" transition={500} />
          <View style={[styles.miniStatus, { backgroundColor: item.color }]}>
            <Text style={styles.miniStatusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>EGP {item.price}</Text>
            <TouchableOpacity 
              onPress={() => {
                if (isFav) {
                  removeFromWishlist(item.id);
                } else {
                  addToWishlist({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    img: item.img
                  });
                }
              }}
              style={styles.heartIconContainer}
            >
                <Ionicons 
                  name={isFav ? "heart" : "heart-outline"} 
                  size={20} 
                  color={isFav ? "#F44336" : "#7477AF"} 
                />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Shimaa Samer 👋</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity 
              onPress={() => router.push("/wishlist")} 
              style={{ marginRight: 15, padding: 8, backgroundColor: '#F1F5F9', borderRadius: 12 }}
            >
               <Ionicons name="heart" size={22} color="#7477AF" />
            </TouchableOpacity>
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=shimaa' }} style={styles.avatarImg} />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#94A3B8" />
            <TextInput placeholder="Search resources..." style={styles.searchInputField} placeholderTextColor="#94A3B8" />
          </View>
        </View>

        {/* Slider */}
        <View style={styles.sliderWrapper}>
          <FlatList
            ref={sliderRef}
            data={slides}
            keyExtractor={(item) => item.id}
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setActiveSlide(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => (
              <View style={styles.heroCard}>
                <Image source={{ uri: item.img }} style={styles.heroImage} contentFit="cover" />
                <View style={styles.heroOverlay}>
                  <Text style={styles.heroTitle}>{item.title}</Text>
                </View>
              </View>
            )}
          />
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 25, paddingBottom: 10 }}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.catCard}>
              <View style={styles.catIconBg}>
                <Text style={{ fontSize: 32 }}>{cat.icon}</Text>
              </View>
              <Text style={styles.catName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* New Arrivals */}
        <Text style={styles.sectionTitle}>New Arrivals ✨</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 25, paddingBottom: 10 }}>
          {studyItems.map((item) => renderItemCard(item, true))}
        </ScrollView>

        {/* Grid View */}
        <Text style={styles.sectionTitle}>Explore All</Text>
        <View style={styles.gridContainer}>
          {studyItems.map((item) => renderItemCard(item))}
        </View>
      </ScrollView>

      {/* شيلنا الـ navWrapper من هنا لأنه موجود دلوقتي في الـ _layout.tsx */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFBFF" },
  header: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 25, paddingTop: 60, alignItems: 'center' },
  welcomeText: { color: "#AAA", fontSize: 13 },
  userName: { fontSize: 22, fontWeight: "800", color: "#2D2F56" },
  avatarImg: { width: 45, height: 45, borderRadius: 22.5 },
  searchSection: { paddingHorizontal: 25, marginVertical: 20 },
  searchInputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", height: 55, borderRadius: 20, paddingHorizontal: 18, elevation: 5, shadowColor: '#000', shadowOpacity: 0.05 },
  searchInputField: { flex: 1, marginLeft: 12, fontWeight: '500' },
  sliderWrapper: { height: 210, alignItems: 'center' },
  heroCard: { width: width, height: 185, justifyContent: "center", alignItems: 'center' },
  heroImage: { width: width * 0.9, height: "100%", borderRadius: 28 },
  heroOverlay: { position: "absolute", left: 40, bottom: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 15 },
  heroTitle: { color: "#FFF", fontSize: 18, fontWeight: "800" },
  catCard: { alignItems: 'center', marginRight: 22 },
  catIconBg: { width: 85, height: 85, backgroundColor: '#FFF', borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#7477AF', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, marginBottom: 10 },
  catName: { fontSize: 13, fontWeight: '700', color: '#475569' },
  sectionTitle: { fontSize: 20, fontWeight: "800", marginLeft: 25, marginTop: 25, marginBottom: 15, color: '#2D2F56' },
  premiumCard: { width: '47%', backgroundColor: '#FFF', borderRadius: 28, marginBottom: 20, elevation: 8, overflow: 'hidden' },
  imageWrapper: { width: '100%', height: 130 },
  cardImg: { width: '100%', height: '100%' },
  miniStatus: { position: 'absolute', bottom: 10, left: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  miniStatusText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1A1C3D' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  cardPrice: { fontSize: 13, fontWeight: '700', color: '#7477AF' },
  heartIconContainer: { padding: 5 }, 
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 25 },
});