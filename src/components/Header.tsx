import { StyleSheet, Text, TextInput, View } from 'react-native';

interface HeaderProps {
    onSearch: (query: string) => void;
}
export default function Header({ onSearch }: HeaderProps) {
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
                <TextInput
                    placeholder='🔍 Search Laptops...'
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
        padding: 5,
        backgroundColor: "#2c252530",
    },
    searchInput: {
        color: "#000",
        width: 160,
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