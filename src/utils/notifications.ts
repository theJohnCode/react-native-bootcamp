import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const EXPIRY_CHANNEL_ID = "listing-expiry";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Configures how notifications are presented while the app is in the
 * foreground (as a banner/alert). Call this once, as early as possible
 * (e.g. from the root layout).
 */
export function configureForegroundNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Ensures the Android notification channel used for listing-expiry
 * reminders exists. Required on Android 8+ before notifications can be
 * shown; a no-op on iOS.
 */
export async function ensureAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(EXPIRY_CHANNEL_ID, {
    name: "Listing Updates",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
  });
}

/**
 * Requests notification permissions from the user, only asking if not
 * already granted. Push/local notifications aren't fully supported on
 * simulators/emulators, so we bail out early there.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn(
      "Must use a physical device for full notification support (simulators/emulators are unreliable).",
    );
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

/**
 * Schedules a local notification reminding the seller that their listing
 * expires tomorrow. Fires one day before `laptop.expiresAt`; if that time
 * has already passed (e.g. a very short expiry window), falls back to
 * firing a few seconds from now so the pipeline can still be exercised.
 *
 * Best-effort: never throws. Returns the scheduled notification's
 * identifier, or null if scheduling failed / permission was denied.
 */
export async function scheduleListingExpiryNotification(laptop: {
  id: string;
  title: string;
  expiresAt: string;
}): Promise<string | null> {
  try {
    const granted = await requestNotificationPermissions();
    if (!granted) return null;

    await ensureAndroidNotificationChannel();

    const expiryTime = new Date(laptop.expiresAt).getTime();
    const reminderTime = expiryTime - MS_PER_DAY;

    const trigger: Notifications.SchedulableNotificationTriggerInput =
      reminderTime > Date.now()
        ? {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: reminderTime,
            channelId: EXPIRY_CHANNEL_ID,
          }
        : {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 5,
            channelId: EXPIRY_CHANNEL_ID,
          };

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: "Your listing is expiring soon",
        body: `Your listing for ${laptop.title} expires tomorrow.`,
        data: { laptopId: laptop.id },
      },
      trigger,
    });
  } catch (error) {
    console.warn("Failed to schedule listing expiry notification:", error);
    return null;
  }
}

/**
 * Manual test trigger: schedules a notification a few seconds out so the
 * notification pipeline can be verified end-to-end on a device (e.g. via an
 * EAS dev client). Returns the identifier, or null on failure / denied
 * permission.
 */
export async function sendTestNotificationAsync(
  laptopId?: string,
): Promise<string | null> {
  try {
    const granted = await requestNotificationPermissions();
    if (!granted) return null;

    await ensureAndroidNotificationChannel();

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "This is a test push from ZoweHub — tap to open a listing.",
        data: laptopId ? { laptopId } : undefined,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        channelId: EXPIRY_CHANNEL_ID,
      },
    });
  } catch (error) {
    console.warn("Failed to schedule test notification:", error);
    return null;
  }
}

/** Best-effort wrapper around cancelling a previously scheduled notification. */
export async function cancelScheduledNotification(id: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (error) {
    console.warn("Failed to cancel scheduled notification:", error);
  }
}
