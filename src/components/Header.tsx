import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

export default function Header() {
    return (
        <View style={styles.header}>
            <View style={styles.brandRow}>
                <View style={styles.logoMark}>
                    <Text style={styles.logoText}>
                        Z
                    </Text>
                </View>
                {/* <Image source={require("@/assets/images/icon.png")} style={{width: 30, height: 30, borderRadius: 50}} /> */}
                <Text style={styles.brandText}>ZoweHub</Text>
            </View>

            <View style={styles.searchBar}>
                <Text style={styles.searchText}>🔍 Search Laptops...</Text>
            </View>

            <View style={styles.filterIconButton}>
                <Text style={styles.filterIcon}>☰</Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: 'center',
        gap: 8,
    },
    brandRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    logoMark: {
        width: 30,
        height: 30,
        borderRadius: 50,
        backgroundColor: "#1D9E75",
        alignItems: "center",
        justifyContent: "center"
    },
    logoText: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "800"
    },
    brandText: {
        color: "#1D9E75",
        fontSize: 16,
        fontWeight: 700
    },
    searchBar: {
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#2c252530"
    },
    searchText: {
        color: "#000"
    },
    filterIconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0F4F1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterIcon:{
        fontSize: 16
    }
});