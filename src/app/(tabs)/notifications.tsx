import { sendTestNotificationAsync } from '@/utils/notifications';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const [sending, setSending] = useState(false);

  const handleSendTest = async () => {
    setSending(true);
    try {
      const identifier = await sendTestNotificationAsync();
      if (identifier) {
        Alert.alert(
          'Test notification scheduled',
          'It should arrive in about 5 seconds. Background the app and tap it when it arrives.',
        );
      } else {
        Alert.alert(
          "Couldn't schedule notification",
          'Notification permission may have been denied, or this is running on a simulator without full notification support.',
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to schedule notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          ZoweHub reminds sellers a day before their listing expires. When you
          create a listing, we schedule a local notification that fires 24
          hours before its expiry date.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Test the notification pipeline</Text>
          <Text style={styles.cardText}>
            Fire a test notification a few seconds from now — useful for
            verifying everything works on a real device via an EAS dev build.
          </Text>
          <Pressable
            style={[styles.button, sending && styles.buttonDisabled]}
            onPress={handleSendTest}
            disabled={sending}
          >
            <Text style={styles.buttonText}>
              {sending ? 'Scheduling...' : 'Send Test Notification'}
            </Text>
          </Pressable>
        </View>
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
  card: {
    marginTop: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#1D9E75',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
