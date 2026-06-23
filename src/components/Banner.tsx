import { Image } from 'expo-image'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function Banner(props: { title: string, subtitle: string, subtitle2: string, imageUri?: string }) {
    return (
        <View>
            <Text style={styles.subtitle}>{props.subtitle}</Text>
            <TouchableOpacity onPress={() => { console.log(`Banner pressed: ${props.title}`) }}>
            <View style={styles.banner}>
                {/* Left side */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{props.title}</Text>
                    <Text style={styles.subtitle2}>{props.subtitle2}</Text>
                </View>
                {/* Right Image */}
                <Image source={{ uri: props.imageUri ?? "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80" }} style={styles.bannerImage} />
            </View>
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    subtitle: {
        fontSize: 22,
        lineHeight: 28,
        fontWeight: '700',
    },
    banner: {
        backgroundColor: '#1D9E75', // ZoweHub primary green
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row', // Side-by-side layout
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        minHeight: 90,
        width: 350,
    },
    textContainer: {
        flex: 1, // Takes up remaining space after the image
        gap: 2,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    subtitle2: {
        color: '#D4F0E4', // Lighter green for secondary text
        fontSize: 15,
        fontWeight: '600',
    },
    bannerImage: {
        width: 100,
        height: 70,
    },
})