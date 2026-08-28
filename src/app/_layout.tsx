import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { BannerProvider } from "@/contexts/BannerContext";
import { ListingsProvider } from "@/contexts/ListingsContext";
import {
  configureForegroundNotificationHandler,
  ensureAndroidNotificationChannel,
} from "@/utils/notifications";
import { Stack, useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
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

  // Configure local-notification presentation (foreground banners) and the
  // Android channel required to show them.
  useEffect(() => {
    configureForegroundNotificationHandler();
    ensureAndroidNotificationChannel().catch((error) => {
      console.warn("Failed to set up Android notification channel:", error);
    });
  }, []);

  // Deep-link into a listing when the user taps a notification (the
  // "expires tomorrow" reminder or the manual test notification).
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const laptopId = response.notification.request.content.data?.laptopId;
        if (typeof laptopId === "string") {
          router.push(`/laptop/${laptopId}` as any);
        }
      },
    );

    return () => subscription.remove();
  }, [router]);

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
