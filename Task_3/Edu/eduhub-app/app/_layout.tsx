import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname } from 'expo-router'; 
import { View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { NavbarProvider, useNavbar } from './NavbarContext'; 
import { WishlistProvider } from './WishlistContext'; // استيراد الـ Wishlist
import CustomNavbar from '../components/CustomNavbar';

function LayoutContent() {
  const { visible } = useNavbar();
  const pathname = usePathname();

  // الشاشات اللي دايماً الـ Navbar فيها مخفي
  const isStaticHidden = pathname.includes('chat') || pathname.includes('BookDetails');
  const showNavbar = visible && !isStaticHidden;

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="BookDetails" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="community" />
      </Stack>

      {showNavbar && <CustomNavbar />}
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // الترتيب هنا مهم جداً: الـ Providers لازم تغلف كل حاجة
    <WishlistProvider>
      <NavbarProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <LayoutContent />
        </ThemeProvider>
      </NavbarProvider>
    </WishlistProvider>
  );
}