import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { conditionColors, type LaptopListing } from "@/data/laptop";

const formatPrice = (value: number) => `$${value.toLocaleString()}`;

type LaptopCardProps = {
  item: LaptopListing;
  onPress: () => void;
  isFeatured?: boolean;
  onToggleFavourite?: () => void;
};

export default function LaptopCard({
  item,
  onPress,
  isFeatured = false,
  onToggleFavourite,
}: LaptopCardProps) {
  const conditionColor = conditionColors[item.condition];
  const conditionLabel = item.condition;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />

        {onToggleFavourite && (
          <Pressable
            style={styles.favouriteButton}
            hitSlop={8}
            onPress={(event) => {
              event.stopPropagation();
              onToggleFavourite();
            }}
          >
            <Text style={styles.heartIcon}>{isFeatured ? "❤️" : "🤍"}</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>

          <View
            style={[
              styles.conditionBadge,
              { backgroundColor: conditionColor.background },
            ]}
          >
            <Text
              style={[styles.conditionText, { color: conditionColor.text }]}
            >
              {conditionLabel}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EDE9",
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.97 }],
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    aspectRatio: 1.3,
    backgroundColor: "#F0F4F1",
  },
  favouriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  heartIcon: {
    fontSize: 16,
    color: "#E74C3C",
  },
  cardBody: {
    padding: 8,
    gap: 4,
  },
  cardTitle: {
    lineHeight: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  price: {
    fontSize: 15,
    lineHeight: 20,
    color: "#1A1A1A",
  },
  conditionBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  conditionText: {
    fontSize: 9,
    fontWeight: "600",
  },
});
