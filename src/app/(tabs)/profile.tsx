import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome {user?.name || 'User'}</Text>
        <Text style={styles.subtitle}>Your account, saved laptops, and orders will appear here.</Text>

        {/* ADD a logout button */}
        <Pressable style={{ marginTop: 20, padding: 10, backgroundColor: 'red', borderRadius: 5, alignItems: "center" }}
          onPress={handleLogout}>
          <Text style={{ color: 'white' }}>Logout</Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#6b7280',
  },
});
