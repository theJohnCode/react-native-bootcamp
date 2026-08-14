import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { BannerProvider } from "@/contexts/BannerContext";
import { ListingsProvider } from "@/contexts/ListingsContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function RootLayoutContent() {
  const router = useRouter();
  const { user } = useAuth();


  useEffect(() => {
    // Route based on auth state after component mounts
    const timer = setTimeout(() => {
      if (!user || !user.email) {
        router.replace("/login");
      } else {
        router.replace("/(tabs)");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [user, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1D9E75',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="laptop/[id]" options={{ title: 'Laptop Details', headerShown: true }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ListingsProvider>
          <BannerProvider>
            <RootLayoutContent />
          </BannerProvider>
        </ListingsProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
