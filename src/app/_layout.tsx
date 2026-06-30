import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: '#1D9E75',
        
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }} >

    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="laptop/[id]" options={{ title: 'Laptop Details' }} />
  </Stack>;
}
