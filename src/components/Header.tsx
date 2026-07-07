import { Image } from "expo-image";
import { StyleSheet, Text, TextInput, View } from "react-native";

type HeaderProps = {
  onSearch?: (query: string) => void;
};

export default function Header({ onSearch }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Image
          source={require("@/assets/images/OKSN.jpeg")}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <Text style={styles.brandText}>OKSN Tech</Text>
      </View>

      <View style={styles.searchFilter}>
        <TextInput
          placeholder="Search laptops"
          placeholderTextColor="#4b5563"
          onChangeText={onSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filter}>
        <Text>Menu</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 48,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandText: {
    fontSize: 24,
    fontWeight: "700",
    color: "green",
  },
  searchFilter: {
    flex: 1,
    backgroundColor: "lightgray",
    padding: 8,
    borderRadius: 4,
  },
  searchInput: {
    minWidth: 0,
    color: "#111827",
    padding: 0,
  },
  filter: {
    backgroundColor: "lightgray",
    padding: 8,
    borderRadius: 6,
  },
});
