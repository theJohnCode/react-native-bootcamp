import { conditionColors, LaptopListing } from '@/data/laptop';
import { formatPrice } from '@/utils/format';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type LaptopCardProps = {
    /** The laptop listing data to display */
    item: LaptopListing;

    /** Called when the card is pressed (navigates to detail screen) */
    onPress?: () => void;

    /** Whether this listing is in the user's favourites */
    isFavourite?: boolean;

    /**
     * Called when the favourite heart icon is pressed.
     *
     * WEEK 2 CONCEPT: Function Props
     * The parent component decides WHAT HAPPENS when the heart
     * is pressed. The card just calls this function.
     * This is called "lifting state up" — the card doesn't
     * manage favourites, the parent does.
     */
    onToggleFavourite?: () => void;
};

export default function LaptopCard({ item, onPress, isFavourite, onToggleFavourite }: LaptopCardProps) {
    const conditionColor = conditionColors[item.condition];

    return (
        <Pressable onPress={onPress}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>

            {/* Image Container and the favourite button */}
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.productImage} contentFit="cover" />

                {onToggleFavourite && (
                    <Pressable
                        onPress={(e) => {
                            // Stop the press from also triggering the card's onPress
                            e.stopPropagation();
                            onToggleFavourite();
                        }}
                        style={styles.favouriteButton}
                        hitSlop={8} // Makes the tap target bigger (easier to press)
                    >
                        <Text style={styles.heartIcon}>
                            {isFavourite ? '♥' : '♡'}
                        </Text>
                    </Pressable>
                )}

            </View>

            <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>

                <View style={styles.priceRow}>
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>

                    <View style={[styles.conditionBadge, { backgroundColor: conditionColor.background }]}>
                        <Text style={[styles.conditionText, { color: conditionColor.text }]}>{item.condition}</Text>
                    </View>
                </View>
            </View>

        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E8EDE9',
        overflow: 'hidden', // Clips the image to the card's rounded corners
    },
    cardPressed: {
        opacity: 0.86,
        transform: [{ scale: 0.97 }], // Slight shrink for tap feedback
    },
    imageContainer: {
        position: 'relative', // Allows absolute positioning of the heart button
    },
    productImage: {
        width: '100%',
        aspectRatio: 1.3, // Width:Height ratio — keeps images consistently shaped
        backgroundColor: '#F0F4F1', // Placeholder colour while image loads
    },
    favouriteButton: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 30,
        height: 30,
        borderRadius: 16,
        backgroundColor: 'rgba(234, 223, 223, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heartIcon: {
        fontSize: 20,
        color: '#cf1d0a', // Red heart colour
    },
    cardBody: {
        padding: 8,
        gap: 4,
    },
    cardTitle: {
        lineHeight: 18,
        fontWeight: "600"
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
    },
    price: {
        fontSize: 15,
        lineHeight: 20,
        color: '#1A1A1A',
    },
    conditionBadge: {
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    conditionText: {
        fontSize: 9,
        fontWeight: '600',
    },
    vendorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    vendorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#1D9E75', // ZoweHub green
    },
});
