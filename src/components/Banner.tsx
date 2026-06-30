import { View, Text, StyleSheet, Button, Pressable, Linking } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { router } from 'expo-router';

interface BannerProps {
    title: string;
    subtitle: string;
    subtitle2: string;
    image: string;
    link?: {
        url: string;
        text: string;
    }
}

const openLink = (url: string) => {
    Linking.openURL(url).catch(err =>
        console.error("Couldn't load page", err)
    );
}


export default function Banner({ title, subtitle, subtitle2, image, link }: BannerProps) {
    return (
        <View>
            <Text style={styles.Subtitle}>
                {subtitle}
            </Text>
            <View style={styles.Banner}>
                {/* left side */}
                <View style={styles.Textcontainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.Subtitle2}>{subtitle2}</Text>

                    {link && (
                        <Pressable onPress={() => openLink(link.url)} style={styles.learnMoreButton}>
                            <Text>{link.text}</Text>
                        </Pressable>
                    )}
                </View>

                {/* right side */}
                <Image source={image ?? require("@/assets/images/HP.jpeg")} style={{ width: 100, gap: 16, height: 70 }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Subtitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0085a7',
        lineHeight: 28,

    },
    Banner: {
        borderRadius: 12,
        backgroundColor: '#0e9446',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: "hidden",
        minHeight: 90,
    },
    Textcontainer: {
        flex: 1,
        gap: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.5,
        color: '#fff',
        textTransform: 'uppercase',

    },
    Subtitle2: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        textTransform: 'capitalize',
    },
    learnMoreButton: {
        backgroundColor: '#fff9f9',
        paddingVertical: 8,
        paddingHorizontal: 16,
        width: 150,
        borderRadius: 8,
        marginTop: 8,
        alignItems: 'center',
    }

})