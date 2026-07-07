import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        {/* <View style={styles.logoMark}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
            Henry Tech 
          </Text>
        </View> */}
        <Image source={require("@/assets/images/Henry.png")} style={{width: 35, height: 35, borderRadius:50}} />
        <Text style={styles.brandText}>Henry Tech 
          Hub</Text>
      </View>

      <View style={styles.searchBar}>
        <Text>🔍 Search Gadgets ...</Text>
      </View>

      <View style={styles.FilterIconButton}>
        <Text style={styles.filterIcon}>☰ </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    // backgroundColor: "blue",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoMark: {
    width: 35,
    height: 35,
  },
  brandText: {
    color: "#06139a",
    fontSize: 15,
    fontWeight: "bold",
  },
searchBar: {
   borderRadius: 50,
   padding: 5,
   backgroundColor: "lightgray",
   },
   FilterIconButton: {
    width: 30,
    height: 30,
    borderRadius: 18,
    backgroundColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
   },
   filterIcon: {
    fontSize: 13,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
   }
});
