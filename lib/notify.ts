/* eslint-disable @typescript-eslint/no-explicit-any */
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { log } from './log';
import { completeTask, snoozeTask } from './repo/tasks';

// Check if running in Expo Go (SDK 53+ doesn't support push notifications)
const inExpoGo = Constants.executionEnvironment === 'storeClient';

let permissionGranted = false;

export async function requestPermissions(): Promise<boolean> {
  if (inExpoGo) {
    log('Notifications not available in Expo Go');
    return false;
  }
  
  if (permissionGranted) return true;

  const Notifications = await import('expo-notifications');
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  permissionGranted = finalStatus === 'granted';
  
  if (!permissionGranted) {
    log('Notification permissions denied');
  }

  // Configure notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('tasks', {
      name: 'Tasks & Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
      enableVibrate: true,
    });
  }

  // Set notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  return permissionGranted;
}

export async function scheduleTaskNotification(
  taskId: string,
  title: string,
  dueAt: number
): Promise<string | null> {
  if (inExpoGo) return null;
  
  const hasPermission = await requestPermissions();
  if (!hasPermission) return null;

  try {
    const Notifications = await import('expo-notifications');
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Task Reminder',
        body: title,
        data: { taskId, type: 'task_reminder' },
        categoryIdentifier: 'task_actions',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(dueAt),
      },
    });

    log('Scheduled notification:', notificationId, 'for task:', taskId);
    return notificationId;
  } catch (error) {
    log('Error scheduling notification:', error);
    return null;
  }
}

export async function cancelNotification(notificationId: string): Promise<void> {
  if (inExpoGo) return;
  
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    log('Cancelled notification:', notificationId);
  } catch (error) {
    log('Error cancelling notification:', error);
  }
}

export async function cancelAllTaskNotifications(): Promise<void> {
  if (inExpoGo) return;
  
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.cancelAllScheduledNotificationsAsync();
    log('Cancelled all notifications');
  } catch (error) {
    log('Error cancelling all notifications:', error);
  }
}

export async function setupNotificationCategories(): Promise<void> {
  if (inExpoGo) return;
  
  if (Platform.OS === 'ios') {
    const Notifications = await import('expo-notifications');
    Notifications.setNotificationCategoryAsync('task_actions', [
      {
        identifier: 'complete',
        buttonTitle: 'Complete',
        options: {
          opensAppToForeground: false,
        },
      },
      {
        identifier: 'snooze_30m',
        buttonTitle: 'Snooze 30m',
        options: {
          opensAppToForeground: false,
        },
      },
      {
        identifier: 'snooze_tomorrow',
        buttonTitle: 'Tomorrow',
        options: {
          opensAppToForeground: false,
        },
      },
    ]);
  }
}

export async function setupNotificationListeners(): Promise<void> {
  if (inExpoGo) {
    log('Notification listeners not available in Expo Go (SDK 53+)');
    return;
  }
  
  try {
    const Notifications = await import('expo-notifications');
    
    // Handle notification response (user tapped action)
    Notifications.addNotificationResponseReceivedListener(async (response: any) => {
      const { taskId } = response.notification.request.content.data as { taskId: string };
      const actionId = response.actionIdentifier;

      log('Notification action:', actionId, 'for task:', taskId);

      if (actionId === 'complete') {
        await completeTask(taskId);
      } else if (actionId === 'snooze_30m') {
        const snoozeUntil = Date.now() + 30 * 60 * 1000;
        await snoozeTask(taskId, snoozeUntil);
      } else if (actionId === 'snooze_tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        await snoozeTask(taskId, tomorrow.getTime());
      }
    });

    // Handle foreground notifications
    Notifications.addNotificationReceivedListener((notification: any) => {
      log('Notification received:', notification);
    });
    
    await setupNotificationCategories();
  } catch (error) {
    log('Error setting up notification listeners:', error);
  }
}

// Helper to reschedule a notification
export async function rescheduleNotification(
  taskId: string,
  title: string,
  newDueAt: number
): Promise<string | null> {
  // Note: In a production app, you'd want to track notification IDs
  // and cancel the old one before scheduling the new one
  return scheduleTaskNotification(taskId, title, newDueAt);
}
