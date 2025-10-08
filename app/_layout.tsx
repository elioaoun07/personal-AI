import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
// import 'react-native-gesture-handler'; // Disabled for Expo Go compatibility
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { getDatabase } from '../lib/db';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default function RootLayout() {
  useEffect(() => {
    // Initialize database on app start (native only)
    if (Platform.OS !== 'web') {
      getDatabase();
    }
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}