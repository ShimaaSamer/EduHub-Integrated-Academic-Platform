import React, { useEffect, useRef } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Dimensions, Share, Animated 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
// 1. استيراد الـ Wishlist Context
import { useWishlist } from "./WishlistContext"; 

const { width, height } = Dimensions.get("window");

const getParam = (value: string | string[] | undefined) => {
  if (!value) return "";
  return Array.isArray(value) ? value[0] : value;
};

export default function BookDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // 2. استخدام الـ Context
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // تجهيز بيانات المنتج الحالية
  const productId = getParam(params.id) || "0";
  const productData = {
    id: productId,
    title: getParam(params.title) || "Academic Resource",
    price: getParam(params.price) || "0.00",
    img: getParam(params.image) || 'https://via.placeholder.com/800x600.png?text=EduHub'
  };

  const isFavorite = isInWishlist(productId);

  const sellerName = getParam(params.sellerName) || "Shimaa Samer";
  const sellerImg = getParam(params.sellerImg) || "https://i.pravatar.cc/100?u=shimaa";
  const sellerLevel = getParam(params.sellerLevel) || "Level 4 • Computer Science";

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleMove = useRef(new Animated.Value(20)).current;
  const featuresMove = useRef(new Animated.Value(20)).current;
  const sellerMove = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.stagger(150, [
        Animated.spring(titleMove, { toValue: 0, friction: 6, useNativeDriver: true }),
        Animated.spring(featuresMove, { toValue: 0, friction: 6, useNativeDriver: true }),
        Animated.spring(sellerMove, { toValue: 0, friction: 6, useNativeDriver: true }),
      ])
    ]).start();
  }, []);

  // 3. وظيفة الضغط على القلب
  const toggleWishlist = () => {
    if (isFavorite) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productData);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: productData.img }} 
            style={styles.mainImg} 
            contentFit="cover" 
            transition={1000}
          />
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.glassBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#1A1C3D" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.glassBtn} onPress={() => {
                 Share.share({ message: `Check this on EduHub: ${productData.title}` });
            }}>
              <Ionicons name="share-outline" size={22} color="#1A1C3D" />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={[styles.detailsBox, { opacity: fadeAnim }]}>
          <View style={styles.handle} />
          
          <Animated.View style={{ transform: [{ translateY: titleMove }] }}>
            <View style={styles.mainInfo}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{productData.title}</Text>
                <View style={styles.statusBadge}>
                  <View style={[styles.dot, { backgroundColor: getParam(params.color) || '#7477AF' }]} />
                  <Text style={styles.statusText}>{getParam(params.status) || "Available"}</Text>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.currency}>EGP</Text>
                <Text style={styles.priceValue}>{productData.price}</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.featuresRow, { transform: [{ translateY: featuresMove }] }]}>
            <Feature icon="star" label="4.9 Rating" color="#FFD700" />
            <Feature icon="location-outline" label="Campus" color="#7477AF" />
            <Feature icon="shield-checkmark-outline" label="Verified" color="#4CAF50" />
          </Animated.View>

          <Animated.View style={[styles.sellerCard, { transform: [{ translateY: sellerMove }] }]}>
            <Image source={{ uri: sellerImg }} style={styles.sellerAvatar} />
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.sellerName}>{sellerName}</Text>
              <Text style={styles.sellerLevel}>{sellerLevel}</Text>
            </View>
            <TouchableOpacity style={styles.chatMiniBtn} onPress={() => router.push("/chat")}>
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="#7477AF" />
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              This item is verified by the EduHub team. It's ready for immediate use by students.
            </Text>
          </View>

          <View style={styles.bottomBar}>
            {/* 4. تحديث زرار القلب */}
            <TouchableOpacity style={styles.favBtn} onPress={toggleWishlist}>
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={28} 
                color={isFavorite ? "#F44336" : "#7477AF"} 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mainActionBtn} activeOpacity={0.8}>
              <Text style={styles.mainActionText}>Contact {sellerName.split(' ')[0]}</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const Feature = ({ icon, label, color }: any) => (
  <View style={styles.featureItem}>
    <Ionicons name={icon} size={20} color={color} />
    <Text style={styles.featureLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  imageContainer: { width, height: height * 0.45 },
  mainImg: { width: '100%', height: '100%' },
  topActions: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  glassBtn: { width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  detailsBox: { backgroundColor: '#FBFBFF', marginTop: -40, borderTopLeftRadius: 45, borderTopRightRadius: 45, paddingHorizontal: 25, paddingBottom: 60, minHeight: height * 0.6 },
  handle: { width: 45, height: 5, backgroundColor: '#E2E8F0', alignSelf: 'center', borderRadius: 10, marginTop: 15, marginBottom: 25 },
  mainInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1C3D', flex: 1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, marginTop: 8, elevation: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  priceContainer: { alignItems: 'flex-end' },
  currency: { fontSize: 12, color: '#7477AF', fontWeight: '800' },
  priceValue: { fontSize: 26, fontWeight: '900', color: '#7477AF' },
  featuresRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 25 },
  featureItem: { backgroundColor: '#FFF', padding: 15, borderRadius: 20, width: '31%', alignItems: 'center', elevation: 2 },
  featureLabel: { fontSize: 11, fontWeight: '700', color: '#475569', marginTop: 6 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A1C3D', marginBottom: 10 },
  descriptionText: { fontSize: 15, color: '#64748B', lineHeight: 24 },
  sellerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F1FF', padding: 18, borderRadius: 22, marginBottom: 25 },
  sellerAvatar: { width: 55, height: 55, borderRadius: 18 },
  sellerName: { fontSize: 16, fontWeight: '800', color: '#1A1C3D' },
  sellerLevel: { fontSize: 12, color: '#7477AF' },
  chatMiniBtn: { backgroundColor: '#FFF', padding: 10, borderRadius: 12 },
  bottomBar: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  favBtn: { width: 60, height: 60, backgroundColor: '#FFF', borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  mainActionBtn: { flex: 1, backgroundColor: '#7477AF', height: 60, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  mainActionText: { color: '#FFF', fontSize: 17, fontWeight: '800' }
});