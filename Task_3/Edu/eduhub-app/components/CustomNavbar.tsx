import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

export default function UltimateProfessionalNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams();

  // هل نحن داخل شاشة الشات ؟
  const isChatScreen = params?.isChat === "true";

  const navItems = [
    { path: "/", icon: "home", label: "Home" },
    { path: "/explore", icon: "cart", label: "Cart" },
    { path: "/add", icon: "add", label: "Add", isCenter: true },
    { path: "/chat", icon: "chatbubble-ellipses", label: "AI Chat" },
    { path: "/community", icon: "people", label: "Groups" },
  ];

  // Animations
  const scales = useRef(navItems.map(() => new Animated.Value(1))).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Fade in أول ما التطبيق يفتح
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  // تكبير التاب النشط
  const animateActive = (index: number, active: boolean) => {
    Animated.spring(scales[index], {
      toValue: active ? 1.12 : 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    navItems.forEach((item, i) => {
      animateActive(i, pathname === item.path);
    });
  }, [pathname]);

  // ✨ Hide / Show Navbar لما ندخل الشات
  useEffect(() => {
    if (isChatScreen) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 120,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isChatScreen]);

  const handlePress = (index: number, path: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.timing(scales[index], {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scales[index], {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    router.push(path as any);
  };

  return (
    <Animated.View
      style={[
        styles.navWrapper,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.container}>
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;

          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => handlePress(index, item.path)}
            >
              <Animated.View
                style={[
                  styles.navTab,
                  { transform: [{ scale: scales[index] }] },
                  isActive && !item.isCenter && styles.activeTabBackground,
                ]}
              >
                <View style={item.isCenter ? styles.centerButton : styles.iconWrapper}>
                  <Ionicons
                    name={(isActive ? item.icon : `${item.icon}-outline`) as any}
                    size={item.isCenter ? 30 : 22}
                    color={item.isCenter ? "#FFF" : isActive ? "#7477AF" : "#94A3B8"}
                  />
                </View>

                {!item.isCenter && (
                  <Text style={[styles.navLabel, { color: isActive ? "#7477AF" : "#94A3B8" }]}>
                    {item.label}
                  </Text>
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  navWrapper: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 : 20,
    width: width,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.95)",
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#7477AF",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.8)",
  },
  navTab: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    width: (width - 40) / 5.5,
    borderRadius: 25,
  },
  activeTabBackground: {
    backgroundColor: "rgba(116,119,175,0.12)",
  },
  iconWrapper: {
    marginBottom: 2,
  },
  centerButton: {
    backgroundColor: "#7477AF",
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -45,
    shadowColor: "#7477AF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 4,
    borderColor: "#F8FAFC",
  },
  navLabel: {
    fontSize: 9,
    fontWeight: "800",
    marginTop: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});