/**
 * Safe push token helper that guards against Expo Go limitations in SDK 53+
 */
import Constants from 'expo-constants';

const inExpoGo = Constants.executionEnvironment === 'storeClient';

/**
 * Safely get push token, returns null in Expo Go (SDK 53+)
 */
export async function getPushTokenSafe(): Promise<string | null> {
  if (inExpoGo) {
    console.log('[Push] Skipping push token in Expo Go (not supported in SDK 53+)');
    return null;
  }

  try {
    const Notifications = await import('expo-notifications');
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('[Push] Permission not granted');
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync();
    // Handle different token response formats
    return token?.data ?? token?.type ?? null;
  } catch (error) {
    console.error('[Push] Error getting push token:', error);
    return null;
  }
}
