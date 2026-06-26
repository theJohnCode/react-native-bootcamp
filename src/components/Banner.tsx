import { Image } from 'expo-image'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BannerProps {
    title: string;
    subtitle: string;
    subtitle2: string;
    image: string;
}

export default function Banner({title, subtitle, subtitle2, image}: BannerProps) {
    return (
        <View>
            <Text style={[styles.subtitle, {color: '#1D9E75'}]}>{subtitle}</Text>
            <TouchableOpacity onPress={() => { console.log("Banner pressed: Hello, ZoweHub!") }}>
                <View style={styles.banner}>
                    {/* Left side */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle2}>{subtitle2}</Text>
                    </View>
                    {/* Right Image */}
                    <Image source={image ?? 'https://via.placeholder.com/100'} style={styles.bannerImage} />
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
        color: "red"
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