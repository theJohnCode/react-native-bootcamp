 import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export default function Header() {
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
        <Text>🔎Search laptop</Text>
      </View>

      <View style={styles.filter}>
        <Text>☰</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 38,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandText: {
    fontSize: 24,
    fontWeight: 700,
    color: "green",
  },
  searchFilter: {
    backgroundColor: "lightgray",
    padding: 8,
    borderRadius: 4,
        color: "green",
  },
  filter: {
    backgroundColor: "lightgray",
    padding: 8,
    borderRadius: 6,
    color: "purple ",
  },
});
