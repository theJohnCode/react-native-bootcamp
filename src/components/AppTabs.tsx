/**
 * ============================================================
 * ZoweHub - Bottom Tab Navigation (JavaScript)
 * ============================================================
 *
 * WEEK 3 CONCEPT: Bottom Tab Navigator
 *
 * This component defines the bottom tab bar: Home, Explore,
 * Campus Hub, and Profile.
 *
 * Expo Router uses file-based routing, so each screen name must
 * match a route file in the same route group:
 * - index.tsx      -> "index"
 * - explore.tsx    -> "explore"
 * - campus-hub.tsx -> "campus-hub"
 * - profile.tsx    -> "profile"
 * ============================================================
 */

import { Tabs } from 'expo-router';
import { StyleSheet, Text, useColorScheme } from 'react-native';

const tabColors = {
  light: {
    active: '#1D9E75',
    inactive: '#6b7280',
    border: '#e5e7eb',
    background: '#ffffff',
  },
  dark: {
    active: '#34d399',
    inactive: '#9ca3af',
    border: '#1f2937',
    background: '#111827',
  },
} as const;

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = tabColors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>H</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>S</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="campus-hub"
        options={{
          title: 'Campus Hub',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>C</Text>
          ),
          tabBarBadge: 3,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>P</Text>
          ),
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
});
