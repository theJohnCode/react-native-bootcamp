import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/contexts/ListingsContext";
import { Brand, BRANDS, Condition, CONDITIONS } from "@/data/laptop";
import { getPublicImageUrl, supabase, uploadImage } from "@/utils/supabase";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateLaptopScreen() {
  const { user } = useAuth();
  const { refreshListings } = useListings();


  // Form state
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState<Brand>("HP");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<Condition>("Brand New");
  const [processor, setProcessor] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [batteryHealth, setBatteryHealth] = useState("100");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset: any) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const handleAddListing = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to create a listing");
      return;
    }

    // Validate all fields
    if (!title || !price || !processor || !ram || !storage) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (images.length === 0) {
      Alert.alert("Error", "Please add at least one image");
      return;
    }

    setLoading(true);

    try {
      // Upload images to Supabase Storage
      const uploadedImageUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const fileName = `${user.id}/${Date.now()}-${i}.jpg`;
        // yrury6774748re78r7r7r/6736438383738-0.jpg
        const { data, error } = await uploadImage(images[i], fileName);
        if (error) {
          console.log(error)
          throw new Error(`Failed to upload image ${i + 1}`);
        }
        const publicUrl = getPublicImageUrl(data!.path);
        uploadedImageUrls.push(publicUrl);
      }

      // Create laptop record
      const { data: laptopData, error: laptopError } = await supabase
        .from("laptops")
        .insert({
          user_id: user.id,
          title,
          brand,
          price: parseFloat(price),
          condition,
          processor,
          ram,
          storage,
          battery_health: parseInt(batteryHealth),
          description: description || null,
        })
        .select()
        .single();

      if (laptopError) throw laptopError;

      // Create image records
      const imageRecords = uploadedImageUrls.map((url, index) => ({
        laptop_id: laptopData.id,
        image_url: url,
        is_primary: index === 0,
        sort_order: index,
      }));

      const { error: imagesError } = await supabase
        .from("laptop_images")
        .insert(imageRecords);

      if (imagesError) throw imagesError;

      await refreshListings();

      Alert.alert("Success", "Laptop listing created!");

      // Reset form
      setTitle("");
      setBrand("Apple");
      setPrice("");
      setCondition("Brand New");
      setProcessor("");
      setRam("");
      setStorage("");
      setBatteryHealth("100");
      setDescription("");
      setImages([]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Create Laptop Listing</Text>
          <Text style={styles.subtitle}>
            Fill in the details below to create a new listing
          </Text>

          {/* Images */}
          <View style={styles.section}>
            <Text style={styles.label}>Images</Text>
            <Pressable
              style={styles.imagePickerButton}
              onPress={handlePickImage}
            >
              <Text style={styles.imagePickerButtonText}>+ Add Images</Text>
            </Pressable>
            {images.length > 0 && (
              <View style={styles.imagePreview}>
                {images.map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri }}
                    style={styles.previewImage}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.label}>Laptop Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., MacBook Pro 13 M1"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Brand */}
          <View style={styles.section}>
            <Text style={styles.label}>Brand</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={brand}
                onValueChange={setBrand}
                mode="dropdown"
              >
                {/* fetch brands from laptop.ts file */}
                {BRANDS.map((b) => (
                  <Picker.Item key={b} label={b} value={b} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.label}>Price (₦)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 500000"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          {/* Condition */}
          <View style={styles.section}>
            <Text style={styles.label}>Condition</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={condition}
                onValueChange={setCondition}
                mode="dropdown"
              >
                {CONDITIONS.map((c) => (
                  <Picker.Item key={c} label={c} value={c} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Processor */}
          <View style={styles.section}>
            <Text style={styles.label}>Processor</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Apple M1"
              value={processor}
              onChangeText={setProcessor}
            />
          </View>

          {/* RAM */}
          <View style={styles.section}>
            <Text style={styles.label}>RAM</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 8GB"
              value={ram}
              onChangeText={setRam}
            />
          </View>

          {/* Storage */}
          <View style={styles.section}>
            <Text style={styles.label}>Storage</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 256GB SSD"
              value={storage}
              onChangeText={setStorage}
            />
          </View>

          {/* Battery Health */}
          <View style={styles.section}>
            <Text style={styles.label}>Battery Health (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 100"
              keyboardType="number-pad"
              value={batteryHealth}
              onChangeText={setBatteryHealth}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the laptop condition, any defects, etc."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Create Button */}
          <Pressable
            style={[styles.createButton, loading && styles.disabledButton]}
            onPress={handleAddListing}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? "Creating..." : "Create Listing"}
            </Text>
          </Pressable>

          <View style={styles.spacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#6b7280",
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
  },
  createButton: {
    backgroundColor: "#1D9E75",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 24,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  spacer: {
    height: 40,
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  imagePickerButtonText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "600",
  },
  imagePreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 8,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
