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

import { Colors } from '@/constants/theme';
import {
  faGraduationCap,
  faHouse,
  faMagnifyingGlass,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Tabs } from 'expo-router';
import { StyleSheet, useColorScheme } from 'react-native';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1D9E75',
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          // borderTopColor: colors.backgroundElement,
        },
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faHouse} color={String(color)} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faMagnifyingGlass} color={String(color)} size={20} />
          ),
        }}
      />

      <Tabs.Screen
        name="campus-hub"
        options={{
          title: 'Campus Hub',
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faGraduationCap} color={String(color)} size={22} />
          ),
          tabBarBadge: 3,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faUser} color={String(color)} size={size} />
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
});
