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
  faBell,
  faHouse,
  faMagnifyingGlass,
  faPlus,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Tabs } from 'expo-router';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

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
        name="create-laptop"
        options={{
          title: "",
          tabBarButton: (props) => (
            <TouchableOpacity
              {...Object.fromEntries(
                Object.entries(props).filter(([, v]) => v !== null)
              )}
              style={styles.floatingButton}
            >
              <FontAwesomeIcon
                icon={faPlus}
                color="white"
                size={24}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faBell} color={String(color)} size={22} />
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
  floatingButton: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#1D9E75",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 8,
  },
});
