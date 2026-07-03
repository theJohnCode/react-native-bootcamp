import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

function RootLayoutContent() {
  const router = useRouter();
  const { hasSeenLoginPrompt, user } = useAuth();

  console.log(user, hasSeenLoginPrompt);

  useEffect(() => {
    // Route based on auth state after component mounts
    const timer = setTimeout(() => {
      if (!hasSeenLoginPrompt) {
        router.replace("/login");
      } else {
        router.replace("/(tabs)");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [hasSeenLoginPrompt, router]);

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
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="laptop/[id]" options={{ title: 'Laptop Details', headerShown: true }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
