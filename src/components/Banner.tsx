import { Image } from "expo-image";
import { Linking, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BannerProps {
  title: string;
  subtitle: string;
  subtitle2: string;
  image: string;
  link?:{
    url: string,
    text: string,
  }
}
const openlink = (url: string) =>{
  Linking.openURL(url).catch(err=>
    console.error("Couldnt load page",err)
  )
}

export default function Banner({
  title,
  subtitle,
  subtitle2,
  image,
  link
}: BannerProps) {
  return (
    <View>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <TouchableOpacity
        onPress={() => {
          console.log(`Banner pressed: ${title}`);
        }}
      >
        <View style={styles.banner}>
          {/* Left side */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle2}>{subtitle2}</Text>

            {link && (
              <Pressable onPress={()=> openlink(link.url)} style={styles.learnmore}>
                <Text>{link.text}</Text>
              </Pressable>
            )}
          </View>
          {/* Right Image */}
          <Image
            source={image ?? require("@/assets/images/okk1.webp")}
            style={styles.bannerImage}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    color: "#2e10a4"
  },
  
  learnmore:{
    backgroundColor: "#ffff",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    width: 150,
    alignItems: "center",

  },

  banner: {
    backgroundColor: "#1D9E75", // luckywinz primary green
    borderRadius: 12,
    padding: 16,
    flexDirection: "row", // Side-by-side layout
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    minHeight: 90,
    width: 350,
  },
  textContainer: {
    flex: 1, // Takes up remaining space after the image
    gap: 2,
  },
  title: {
    color: "#e7f8f0",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  subtitle2: {
    color: "#deece6", // Lighter green for secondary text
    fontSize: 15,
    fontWeight: "600",
  },
  bannerImage: {
    width: 100,
    height: 70,
  },
});
