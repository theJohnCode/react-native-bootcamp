import { FlatList, Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import Banner from '@/components/banner';
import { FilterChip } from '@/components/FilterChip';
import Header from "@/components/header";
import LaptopCard from '@/components/LaptopCard';
import { ThemedText } from '@/components/ui/theme-text';
import { Spacing } from '@/constants/theme';
import { brandFilters, conditionFilters, initialListings, priceRangeFilters } from '@/data/laptop';
import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const BannerData = [
  {
    title: "Your One-Stop Gadget Destination.",
    subtitle: "Welcome To Henry Tech Hub",
    subtitle2: "Get the latest smartphones, accessories, laptops, and gadgets at unbeatable prices.",
    image: require('@/assets/images/henry.jpeg')
  },
  {
    title: "100% Quality You Can Trust.", 
    subtitle: "Top Quality. Best Prices. Everytime.",
    subtitle2: "Enjoy genuine Gadgets with secure payment, fast delivery, and reliable customer support.",
    image: require('@/assets/images/h.jpeg')
  },
  {
    title: "Shop Smarter With Henry Tech Hub.",
    subtitle: "Upgrade Your Tech Life",
    subtitle2: "Discover, Shop, and Enjoy latest gadgets, authentic products, and unbeatable value.",
    image: require('@/assets/images/he.jpeg')
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

  const priceRangeLabels = useMemo(
    () => priceRangeFilters.map((filter) => filter.label),
    []
  );

  const filteredListings = useMemo(() => {
    const activePriceRange = priceRangeFilters[selectedPriceRange];

    return initialListings.filter((listing) => {
      const matchesBrand = selectedBrand === 'All' || listing.brand === selectedBrand;
      const matchesCondition = selectedCondition === 'All' || listing.condition === selectedCondition;
      const matchesPrice =
        listing.price >= activePriceRange.min && listing.price <= activePriceRange.max;

      return matchesBrand && matchesCondition && matchesPrice;
    });
  }, [selectedBrand, selectedCondition, selectedPriceRange]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.screen}>
          <Header />


          <FlatList
            key={columns}
            data={filteredListings}
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
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingVertical: 16 }}>
                  {BannerData.map((banner, index) => (
                    <Banner key={index} {...banner} />
                  ))}
                </ScrollView>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterRow}
                >
                  {/* Brand filter chip */}
                  <FilterChip
                    label={selectedBrand === 'All' ? 'Brand' : selectedBrand}
                    selected={selectedBrand !== 'All'}
                    options={brandFilters}
                    selectedValue={selectedBrand}
                    onSelect={(value) => setSelectedBrand(value as (typeof brandFilters)[number])}
                  />

                  {/* Condition filter chip */}
                  <FilterChip
                    label={selectedCondition === 'All' ? 'Condition' : selectedCondition}
                    selected={selectedCondition !== 'All'}
                    options={conditionFilters}
                    selectedValue={selectedCondition}
                    onSelect={(value) => setSelectedCondition(value as (typeof conditionFilters)[number])}
                  />

                  {/* Price range filter chip */}
                  <FilterChip
                    label={
                      selectedPriceRange === 0
                        ? 'Price Range'
                        : priceRangeFilters[selectedPriceRange].label
                    }
                    selected={selectedPriceRange !== 0}
                    options={priceRangeLabels}
                    selectedValue={priceRangeFilters[selectedPriceRange].label}
                    onSelect={(value) => {
                      const nextIndex = priceRangeFilters.findIndex((filter) => filter.label === value);
                      setSelectedPriceRange(Math.max(0, nextIndex));
                    }}
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
    gap: 8,
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
    padding: 20
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