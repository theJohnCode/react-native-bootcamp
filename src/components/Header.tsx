import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';


export default function () {
    return (
        <View style={styles.header}>
            <View style={styles.brandRow}>
                <Image source={require("@/assets/images/img.jpeg")} style={{ width: 50, borderRadius: 50, height: 50 }} />
                <Text style={styles.brandText}>Laptop Mall</Text>
            </View>

            <View><Text style={styles.search}>🔍 Search laptop</Text></View>
            <View><Text style={styles.filter}> ☰ </Text></View>
        </View>
    )
} 

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '',
        // marginTop: 60,
        borderRadius: 15,
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',

    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    brandText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0085a7',

    },
    search: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
    },
    filter: {
        backgroundColor: '#646b2c',
        padding: 10,
        borderRadius: 8,
        opacity: 1,
    },
});