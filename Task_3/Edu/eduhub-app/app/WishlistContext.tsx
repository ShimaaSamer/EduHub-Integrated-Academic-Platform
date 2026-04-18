import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Product = {
  id: string;
  title: string;
  price: string;
  img: string;
};

type WishlistContextType = {
  wishlist: Product[];
  addToWishlist: (item: Product) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // تحميل البيانات من الذاكرة عند فتح التطبيق
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const saved = await AsyncStorage.getItem('@edu_wishlist');
        if (saved) setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load wishlist");
      }
    };
    loadWishlist();
  }, []);

  // حفظ البيانات تلقائياً عند أي تغيير
  useEffect(() => {
    const saveWishlist = async () => {
      try {
        await AsyncStorage.setItem('@edu_wishlist', JSON.stringify(wishlist));
      } catch (e) {
        console.error("Failed to save wishlist");
      }
    };
    saveWishlist();
  }, [wishlist]);

  const addToWishlist = (item: Product) => {
    setWishlist((prev) => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter(item => item.id !== id));
  };

  const isInWishlist = (id: string) => wishlist.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};