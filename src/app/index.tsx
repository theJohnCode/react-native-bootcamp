import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import Banner from '@/components/Banner';
import Header from "@/components/Header";
import { SafeAreaView } from 'react-native-safe-area-context';

const BannerData = [
  {
    title: "Welcome to ZoweHub",
    subtitle: "Mainframe innovation",
  subtitle2: "Development with ZoweHub.",
    imageUri: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80"
  },
  {
    title: "Discover New Features",
    subtitle: "Mainframe technology",
    subtitle2: "Newest tools and features.",
    imageUri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80"
  },
  {
    title: "Join the Community",
    subtitle: "Developers and enthusiasts",
    subtitle2: "ZoweHub community.",
    imageUri: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=80"
  }
];

export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.screen}>
          <Header />
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingVertical: 16 }}>
            {BannerData.map((banner, index) => (
              <Banner key={index} {...banner} />
            ))}
          </ScrollView>

          
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center'
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 800, // Cap width on tablets/web
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: 50, android: 80 }) ?? 0,
  },
})