import { Image } from 'expo-image';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface HeaderProps {
    onSearch: (query: string) => void;
}
export default function Header({ onSearch }: HeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.brandRow}>
                {/* <View style={styles.logoMark}>
                    <Text style={styles.logoText}>
                        Z
                    </Text>
                </View> */}
                <Image source={require("@/assets/images/img.jpeg")} style={{width: 35, height: 35, borderRadius: 50}} />
                <Text style={styles.brandText}>Laptop Mall </Text>
            </View>

            <View style={styles.searchBar}>
                <TextInput
                    placeholder='🔍 Search Laptops'
                    onChangeText={onSearch}
                    style={styles.searchInput} />
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
        width: 50,
        height: 50,
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
        borderRadius: 30,
        padding: 5,
        backgroundColor: "#2c252530",
    },
    searchInput: {
        color: "#000",
        width: 150,
    },
    filterIconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0F4F1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterIcon: {
        fontSize: 16
    }
});