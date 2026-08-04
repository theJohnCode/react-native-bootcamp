import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import {
  faCamera,
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, profile, logout, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || "");
  const [editLocation, setEditLocation] = useState(profile?.location || "");
  const [editPhone, setEditPhone] = useState(profile?.phone || "");
  const [loading, setLoading] = useState(false);
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    const { error } = await updateProfile({
      name: editName,
      location: editLocation,
      phone: editPhone,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", "Failed to update profile");
    } else {
      Alert.alert("Success", "Profile updated successfully");
      setIsEditing(false);
    }
  };

  const handleEditPress = () => {
    setEditName(profile?.name || "");
    setEditLocation(profile?.location || "");
    setEditPhone(profile?.phone || "");
    setIsEditing(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        {/* Header with Avatar */}
        <View style={styles.header}>
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: colors.backgroundElement },
            ]}
          >
            {profile?.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: "#1D9E75" },
                ]}
              >
                <Text style={styles.avatarInitials}>
                  {profile?.name
                    ? getInitials(profile.name)
                    : user?.email?.[0].toUpperCase()}
                </Text>
              </View>
            )}
            <Pressable style={styles.cameraButton}>
              <FontAwesomeIcon icon={faCamera} size={16} color="white" />
            </Pressable>
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {profile?.name || "User"}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email}
            </Text>
            <View style={styles.ratingContainer}>
              <FontAwesomeIcon icon={faStar} size={16} color="#FFD700" />
              <Text style={[styles.rating, { color: colors.text }]}>
                {profile?.rating?.toFixed(1) || "0.0"}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.backgroundElement },
            ]}
          >
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.background },
                ]}
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <View style={styles.infoContent}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Email
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {user?.email}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.backgroundElement },
            ]}
          >
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.background },
                ]}
              >
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <View style={styles.infoContent}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Location
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {profile?.location || "Not set"}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.backgroundElement },
            ]}
          >
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.background },
                ]}
              >
                <FontAwesomeIcon
                  icon={faPhone}
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <View style={styles.infoContent}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Phone
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {profile?.phone || "Not set"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Pressable
            style={[styles.editButton, { backgroundColor: "#1D9E75" }]}
            onPress={handleEditPress}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>

          <Pressable
            style={[
              styles.logoutButton,
              {
                backgroundColor: colors.backgroundElement,
                borderColor: "#ef4444",
              },
            ]}
            onPress={handleLogout}
          >
            <Text style={[styles.logoutButtonText, { color: "#ef4444" }]}>
              Logout
            </Text>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={isEditing}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.backgroundElement },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit Profile
            </Text>

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.textSecondary,
                },
              ]}
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Location
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.textSecondary,
                },
              ]}
              value={editLocation}
              onChangeText={setEditLocation}
              placeholder="Enter your location"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Phone
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.textSecondary,
                },
              ]}
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="Enter your phone"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                  { backgroundColor: "#ef4444" },
                ]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modalButton,
                  styles.saveButton,
                  { backgroundColor: "#1D9E75" },
                ]}
                onPress={handleSaveProfile}
                disabled={loading}
              >
                <Text style={styles.modalButtonText}>
                  {loading ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1D9E75",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  headerText: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
  },
  actions: {
    marginTop: "auto",
  },
  editButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
