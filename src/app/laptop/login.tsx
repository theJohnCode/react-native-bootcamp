import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/theme';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const { login, skipLogin } = useAuth();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const handleLogin = () => {
    if (username.trim()) {
      login(username);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome to ZoweHub</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sign in to get started
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundElement,
              color: colors.text,
              borderColor: colors.textSecondary,
            },
          ]}
          placeholder="Enter your username"
          placeholderTextColor={colors.textSecondary}
          value={username}
          onChangeText={setUsername}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: '#1D9E75' }]}
          onPress={handleLogin}
          disabled={!username.trim()}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={skipLogin}
        >
          <Text style={[styles.skipButtonText, { color: '#1D9E75' }]}>
            Skip for now
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    maxWidth: 300,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});