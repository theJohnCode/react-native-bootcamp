import { FlatList, Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import Banner from '@/components/Banner';
import { FilterChip } from '@/components/FilterChip';
import Header from "@/components/Header";
import LaptopCard from '@/components/LaptopCard';
import { ThemedText } from '@/components/ui/theme-text';
import { Spacing } from '@/constants/theme';
import { brandFilters, conditionFilters, initialListings, priceRangeFilters } from '@/data/laptop';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const BannerData = [
  {
    title: "Welcome to ZoweHub",
    subtitle: "Mainframe innovation",
    subtitle2: "Development with ZoweHub.",
    image: require('@/assets/images/mock-ui.png')
  },
  {
    title: "Discover New Features",
    subtitle: "Mainframe technology",
    subtitle2: "Newest tools and features.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80"
  },
  {
    title: "Join the Community",
    subtitle: "Developers and enthusiasts",
    subtitle2: "ZoweHub community.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=80"
  },

];

export default function Home() {
  const { width } = useWindowDimensions();

  const isWide = width >= 720;
  const columns = isWide ? 3 : 2;

  /**
   * The currently selected brand filter.
   * 'All' means show all brands (no filter applied).
   */
  const [selectedBrand, setSelectedBrand] = useState<(typeof brandFilters)[number]>('All');

  /**
   * The currently selected condition filter.
   * 'All' means show all conditions.
   */
  const [selectedCondition, setSelectedCondition] = useState<(typeof conditionFilters)[number]>('All');

  /**
   * Index into the priceRangeFilters array.
   * 0 = "All Prices" (no filter)
   */
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);

  /**
   * Cycle through brand filters when the chip is pressed.
   * Each press moves to the next brand in the list.
   */
  const cycleBrandFilter = useCallback(() => {
    setSelectedBrand((current) => {
      const currentIndex = brandFilters.indexOf(current);
      const nextIndex = (currentIndex + 1) % brandFilters.length;
      return brandFilters[nextIndex];
    });
  }, []);

  /**
   * Cycle through condition filters when the chip is pressed.
   */
  const cycleConditionFilter = useCallback(() => {
    setSelectedCondition((current) => {
      const currentIndex = conditionFilters.indexOf(current);
      const nextIndex = (currentIndex + 1) % conditionFilters.length;
      return conditionFilters[nextIndex];
    });
  }, []);

  /**
   * Cycle through price range filters when the chip is pressed.
   */
  const cyclePriceRangeFilter = useCallback(() => {
    setSelectedPriceRange((current) => {
      return (current + 1) % priceRangeFilters.length;
    });
  }, []);

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

          <FlatList
            key={columns}
            data={initialListings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <LaptopCard
                item={item}
                onPress={() => console.log(`Navigate to details for ${item.title}`)}
                isFavourite={false}
                onToggleFavourite={() => console.log(`Toggle favourite for ${item.title}`)}
              />
            )}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.gridRow}
            numColumns={2}
            contentContainerStyle={styles.gridContent}

            ListHeaderComponent={
              <View style={styles.listHeader}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
                >
                  {/* Brand filter chip */}
                  <FilterChip
                    label={selectedBrand === 'All' ? 'Brand' : selectedBrand}
                    selected={selectedBrand !== 'All'}
                    onPress={cycleBrandFilter}
                    hasDropdown
                  />

                  {/* Condition filter chip */}
                  <FilterChip
                    label={selectedCondition === 'All' ? 'Condition' : selectedCondition}
                    selected={selectedCondition !== 'All'}
                    onPress={cycleConditionFilter}
                    hasDropdown
                  />

                  {/* Price range filter chip */}
                  <FilterChip
                    label={
                      selectedPriceRange === 0
                        ? 'Price Range'
                        : priceRangeFilters[selectedPriceRange].label
                    }
                    selected={selectedPriceRange !== 0}
                    onPress={cyclePriceRangeFilter}
                    hasDropdown
                  />
                </ScrollView>
              </View>
            }

            ListEmptyComponent={
              <View style={styles.emptyState}>
                <ThemedText style={styles.emptyEmoji}>🔍</ThemedText>
                <ThemedText type="smallBold">No laptops found</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                  Try adjusting your search or filters
                </ThemedText>
              </View>
            }
          />
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
  gridRow: {
    gap: 8
  },
  gridContent: {
    paddingBottom: 24,
    gap: 8, // Vertical gap between rows
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
    gap: Spacing.two,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    textAlign: 'center',
  },
  listHeader: {
    gap: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
   filterRow: {
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
})