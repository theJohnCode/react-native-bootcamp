import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/contexts/ListingsContext";
import { Brand, BRANDS, Condition, CONDITIONS } from "@/data/laptop";
import { formatPrice } from "@/utils/format";
import {
  deleteImage,
  getPublicImageUrl,
  supabase,
  uploadImage,
} from "@/utils/supabase";
import { Picker } from "@react-native-picker/picker";
import { Slider } from "@expo/ui/community/slider";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useRef, useState } from "react";
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

const MAX_IMAGES = 6;

type FormErrors = Partial<
  Record<"title" | "price" | "processor" | "ram" | "storage" | "images", string>
>;

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
  const [batteryHealth, setBatteryHealth] = useState(100);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const priceRef = useRef<TextInput>(null);
  const processorRef = useRef<TextInput>(null);
  const ramRef = useRef<TextInput>(null);
  const storageRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Not logged in — prompt to sign in before they invest time in the form.
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptEmoji}>🔒</Text>
          <Text style={styles.loginPromptTitle}>Sign in to list a laptop</Text>
          <Text style={styles.loginPromptText}>
            You need an account to create a listing on ZoweHub.
          </Text>
          <Pressable
            style={styles.loginPromptButton}
            onPress={() => router.push("/login" as any)}
          >
            <Text style={styles.loginPromptButtonText}>Go to Login</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handlePickImage = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert("Limit reached", `You can add up to ${MAX_IMAGES} photos.`);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES - images.length,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset: any) => asset.uri);
      setImages((prev) => [...prev, ...newImages].slice(0, MAX_IMAGES));
      clearError("images");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [selected] = next.splice(index, 1);
      next.unshift(selected);
      return next;
    });
  };

  const resetForm = () => {
    setTitle("");
    setBrand("HP");
    setPrice("");
    setCondition("Brand New");
    setProcessor("");
    setRam("");
    setStorage("");
    setBatteryHealth(100);
    setDescription("");
    setImages([]);
    setErrors({});
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!title.trim()) nextErrors.title = "Title is required";

    if (!price.trim()) {
      nextErrors.price = "Price is required";
    } else if (Number.isNaN(Number(price)) || Number(price) <= 0) {
      nextErrors.price = "Enter a valid price";
    }

    if (!processor.trim()) nextErrors.processor = "Processor is required";
    if (!ram.trim()) nextErrors.ram = "RAM is required";
    if (!storage.trim()) nextErrors.storage = "Storage is required";
    if (images.length === 0) nextErrors.images = "Add at least one photo";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAddListing = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    setUploadProgress({ completed: 0, total: images.length });

    // Track everything that made it to Storage so we can clean up if a
    // later step fails (avoids orphaned files / broken listings).
    const uploaded: { path: string; url: string }[] = [];
    let createdLaptopId: string | null = null;

    try {
      // 1. Upload all images in parallel.
      const settled = await Promise.allSettled(
        images.map(async (uri, i) => {
          const fileName = `${user.id}/${Date.now()}-${i}.jpg`;
          const { data, error } = await uploadImage(uri, fileName);
          setUploadProgress((prev) =>
            prev ? { ...prev, completed: prev.completed + 1 } : prev,
          );
          if (error || !data) {
            throw error || new Error(`Failed to upload image ${i + 1}`);
          }
          return { path: data.path, url: getPublicImageUrl(data.path) };
        }),
      );

      setUploadProgress(null);

      const failedCount = settled.filter((r) => r.status === "rejected").length;
      const fulfilled = settled
        .filter(
          (r): r is PromiseFulfilledResult<{ path: string; url: string }> =>
            r.status === "fulfilled",
        )
        .map((r) => r.value);

      uploaded.push(...fulfilled);

      if (failedCount > 0) {
        throw new Error(
          `Failed to upload ${failedCount} of ${images.length} image(s). Please try again.`,
        );
      }

      // 2. Create the laptop record.
      const { data: laptopData, error: laptopError } = await supabase
        .from("laptops")
        .insert({
          user_id: user.id,
          title: title.trim(),
          brand,
          price: Number(price),
          condition,
          processor: processor.trim(),
          ram: ram.trim(),
          storage: storage.trim(),
          battery_health: Math.round(batteryHealth),
          description: description.trim() || null,
        })
        .select()
        .single();

      if (laptopError) throw laptopError;
      createdLaptopId = laptopData.id;

      // 3. Create the image records, in the order the user arranged them.
      const imageRecords = uploaded.map((item, index) => ({
        laptop_id: laptopData.id,
        image_url: item.url,
        is_primary: index === 0,
        sort_order: index,
      }));

      const { error: imagesError } = await supabase
        .from("laptop_images")
        .insert(imageRecords);

      if (imagesError) throw imagesError;

      await refreshListings();

      const newLaptopId = laptopData.id;
      resetForm();

      Alert.alert("Success", "Laptop listing created!", [
        { text: "Add Another", style: "cancel" },
        {
          text: "View Listing",
          onPress: () => router.push(`/laptop/${newLaptopId}` as any),
        },
      ]);
    } catch (error: any) {
      // Best-effort rollback so we don't leave orphaned data behind.
      if (createdLaptopId) {
        await supabase.from("laptops").delete().eq("id", createdLaptopId);
      }
      await Promise.all(
        uploaded.map((item) => deleteImage(item.path).catch(() => {})),
      );

      Alert.alert("Error", error.message || "Failed to create listing");
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  const priceNumber = Number(price);
  const pricePreview =
    price.trim() && !Number.isNaN(priceNumber) && priceNumber > 0
      ? formatPrice(priceNumber)
      : null;

  const buttonLabel = loading
    ? uploadProgress
      ? `Uploading photos ${uploadProgress.completed}/${uploadProgress.total}...`
      : "Creating..."
    : "Create Listing";

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexOne}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Laptop Listing</Text>
          <Text style={styles.subtitle}>
            Fill in the details below to create a new listing
          </Text>

          {/* Images */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Images <Text style={styles.required}>*</Text>
            </Text>
            <Pressable
              style={[
                styles.imagePickerButton,
                images.length >= MAX_IMAGES && styles.disabledButton,
              ]}
              onPress={handlePickImage}
              disabled={images.length >= MAX_IMAGES}
            >
              <Text style={styles.imagePickerButtonText}>
                {images.length >= MAX_IMAGES
                  ? "Photo limit reached"
                  : "+ Add Images"}
              </Text>
            </Pressable>

            {images.length > 0 && (
              <>
                <View style={styles.imagePreview}>
                  {images.map((uri, index) => (
                    <Pressable
                      key={uri + index}
                      style={styles.thumbnailWrapper}
                      onPress={() => handleSetPrimaryImage(index)}
                    >
                      <Image source={{ uri }} style={styles.previewImage} />
                      {index === 0 && (
                        <View style={styles.coverBadge}>
                          <Text style={styles.coverBadgeText}>Cover</Text>
                        </View>
                      )}
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        style={styles.removeImageButton}
                        hitSlop={8}
                      >
                        <Text style={styles.removeImageIcon}>×</Text>
                      </Pressable>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.helperText}>
                  Tap a photo to make it the cover image. {images.length}/
                  {MAX_IMAGES} added.
                </Text>
              </>
            )}
            {errors.images && (
              <Text style={styles.errorText}>{errors.images}</Text>
            )}
          </View>

          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Laptop Title <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="e.g., MacBook Pro 13 M1"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                clearError("title");
              }}
              returnKeyType="next"
              onSubmitEditing={() => priceRef.current?.focus()}
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
          </View>

          {/* Brand */}
          <View style={styles.section}>
            <Text style={styles.label}>Brand</Text>
            <View style={styles.picker}>
              <Picker selectedValue={brand} onValueChange={setBrand} mode="dropdown">
                {BRANDS.map((b) => (
                  <Picker.Item key={b} label={b} value={b} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Price (₦) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              ref={priceRef}
              style={[styles.input, errors.price && styles.inputError]}
              placeholder="e.g., 500000"
              keyboardType="numeric"
              value={price}
              onChangeText={(text) => {
                setPrice(text.replace(/[^0-9]/g, ""));
                clearError("price");
              }}
              returnKeyType="next"
              onSubmitEditing={() => processorRef.current?.focus()}
            />
            {pricePreview && !errors.price && (
              <Text style={styles.pricePreview}>≈ {pricePreview}</Text>
            )}
            {errors.price && (
              <Text style={styles.errorText}>{errors.price}</Text>
            )}
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
            <Text style={styles.label}>
              Processor <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              ref={processorRef}
              style={[styles.input, errors.processor && styles.inputError]}
              placeholder="e.g., Apple M1"
              value={processor}
              onChangeText={(text) => {
                setProcessor(text);
                clearError("processor");
              }}
              returnKeyType="next"
              onSubmitEditing={() => ramRef.current?.focus()}
            />
            {errors.processor && (
              <Text style={styles.errorText}>{errors.processor}</Text>
            )}
          </View>

          {/* RAM */}
          <View style={styles.section}>
            <Text style={styles.label}>
              RAM <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              ref={ramRef}
              style={[styles.input, errors.ram && styles.inputError]}
              placeholder="e.g., 8GB"
              value={ram}
              onChangeText={(text) => {
                setRam(text);
                clearError("ram");
              }}
              returnKeyType="next"
              onSubmitEditing={() => storageRef.current?.focus()}
            />
            {errors.ram && <Text style={styles.errorText}>{errors.ram}</Text>}
          </View>

          {/* Storage */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Storage <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              ref={storageRef}
              style={[styles.input, errors.storage && styles.inputError]}
              placeholder="e.g., 256GB SSD"
              value={storage}
              onChangeText={(text) => {
                setStorage(text);
                clearError("storage");
              }}
              returnKeyType="next"
              onSubmitEditing={() => descriptionRef.current?.focus()}
            />
            {errors.storage && (
              <Text style={styles.errorText}>{errors.storage}</Text>
            )}
          </View>

          {/* Battery Health */}
          <View style={styles.section}>
            <View style={styles.sliderLabelRow}>
              <Text style={styles.label}>Battery Health</Text>
              <Text style={styles.sliderValue}>
                {Math.round(batteryHealth)}%
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={batteryHealth}
              onValueChange={setBatteryHealth}
              minimumTrackTintColor="#1D9E75"
              maximumTrackTintColor="#D1D5DB"
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              ref={descriptionRef}
              style={[styles.input, styles.textArea]}
              placeholder="Describe the laptop condition, any defects, etc."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        {/* Sticky footer so the submit button is always reachable */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.createButton, loading && styles.disabledButton]}
            onPress={handleAddListing}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>{buttonLabel}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  flexOne: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 24,
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
  required: {
    color: "#EF4444",
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
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: "#EF4444",
  },
  helperText: {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
  },
  pricePreview: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#059669",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1D9E75",
    marginBottom: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 12 : 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#ffffff",
  },
  createButton: {
    backgroundColor: "#1D9E75",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  spacer: {
    height: 8,
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
  thumbnailWrapper: {
    position: "relative",
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  coverBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(29, 158, 117, 0.9)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  coverBadgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700",
  },
  removeImageButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageIcon: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginPrompt: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  loginPromptEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  loginPromptTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  loginPromptText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  loginPromptButton: {
    marginTop: 20,
    backgroundColor: "#1D9E75",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  loginPromptButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
