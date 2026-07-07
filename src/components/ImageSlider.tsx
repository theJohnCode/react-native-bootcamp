import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    View
} from 'react-native';

// Get device width to make images completely full screen widthwise
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ImageSliderProps {
  images: string[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Track scroll position to update pagination dots dynamically
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / SCREEN_WIDTH);
    setActiveIndex(currentIndex);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled // Crucial: forces the list to stop at total screen item widths
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16} // Fires the scroll hook frequently enough for smooth indicator updates
        snapToAlignment="center"
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
        )}
      />

      {/* Pagination Dots Indicator Row */}
      <View style={styles.dotRow}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: SCREEN_WIDTH,
    height: 250, // Matches standard high-end product presentation height
  },
  dotRow: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 18, // Stretched active capsule look
    backgroundColor: '#059669', // Theme emerald color matching your UI
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#d1d5db',
  },
});