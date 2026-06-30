import ImageSlider from '@/components/ImageSlider';
import { conditionColors, initialListings } from '@/data/laptop';
import { formatPrice } from '@/utils/format';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LapTopDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [isFavorited, setIsFavorited] = useState(false);

  const laptop = initialListings.find((item) => item.id === id);

  const fullSpecs = useMemo(() => {
    if (!laptop) {
      return [];
    }

    return [
      laptop.specs.ram,
      laptop.specs.storage,
      laptop.specs.processor,
      `Battery Health: ${laptop.specs.batteryHealth}% Health`,
    ];
  }, [laptop]);

  const conditionBullets = useMemo(() => {
    if (!laptop) {
      return [];
    }

    return laptop.condition === 'Brand New'
      ? ['Unused and sealed', 'Tested & Certified', 'Includes clean setup support']
      : ['Minimal cosmetic wear', 'Tested & Certified', 'Screen and keyboard checked'];
  }, [laptop]);

  if (!laptop) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Laptop Details' }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Laptop not found</Text>
          <Text style={styles.notFoundText}>This listing may have been removed.</Text>
          <Pressable style={styles.notFoundButton} onPress={() => router.back()}>
            <Text style={styles.notFoundButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const conditionColor = conditionColors[laptop.condition];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: true, title: laptop.title }} />
      <StatusBar barStyle="dark-content" />

      <View style={styles.floatingHeader}>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsFavorited((current) => !current)}
        >
          <Text style={[styles.heartIcon, isFavorited && styles.heartActive]}>
            {isFavorited ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <ImageSlider images={laptop.images} />

        <View style={styles.contentBlock}>
          <View style={styles.titleRow}>
            <Text style={styles.modelText}>{laptop.title}</Text>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: conditionColor.background,
                  borderColor: conditionColor.text,
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: conditionColor.text }]}>
                {laptop.condition}
              </Text>
            </View>
          </View>

          <Text style={styles.priceText}>{formatPrice(laptop.price)}</Text>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          {fullSpecs.map((spec) => (
            <View key={spec} style={styles.specItemRow}>
              <Text style={styles.bulletPoint}>▣</Text>
              <Text style={styles.specItemText}>{spec}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Condition Report</Text>
          <Text style={styles.conditionGradeHeader}>{laptop.condition}</Text>
          {conditionBullets.map((bullet) => (
            <Text key={bullet} style={styles.bulletText}>
              • {bullet}
            </Text>
          ))}
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Seller Information</Text>
          <View style={styles.sellerRow}>
            <View style={styles.avatarMock}>
              <Text style={styles.avatarText}>{laptop.vendor.name.charAt(0)}</Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{laptop.vendor.name}</Text>
              <Text style={styles.sellerRating}>
                ★ {laptop.vendor.rating}/5 stars • {laptop.vendor.location}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerActions}>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]}>
          <Text style={styles.btnPrimaryText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSecondary]}>
          <Text style={styles.btnSecondaryText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    paddingBottom: 108,
  },
  floatingHeader: {
    position: 'absolute',
    top: 200,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#ffffff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  heartIcon: {
    fontSize: 22,
    lineHeight: 24,
    color: '#1f2937',
  },
  heartActive: {
    color: '#E74C3C',
  },
  contentBlock: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  modelText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  priceText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#059669',
    marginTop: 10,
  },
  sectionBlock: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  specItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bulletPoint: {
    marginRight: 10,
    fontSize: 13,
    color: '#059669',
  },
  specItemText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  conditionGradeHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  bulletText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMock: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#0369a1',
    fontWeight: '700',
    fontSize: 18,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  sellerRating: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  footerActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  btnPrimary: {
    backgroundColor: '#059669',
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  btnSecondary: {
    borderWidth: 1,
    borderColor: '#059669',
    backgroundColor: '#ffffff',
  },
  btnSecondaryText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 14,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  notFoundText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 18,
    textAlign: 'center',
  },
  notFoundButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },
  notFoundButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
