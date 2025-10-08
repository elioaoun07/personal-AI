/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import dayjs from 'dayjs';
import { clearDatabase } from '../lib/db';
import { createTask } from '../lib/repo/tasks';
import { scheduleTaskNotification, cancelAllTaskNotifications } from '../lib/notify';
import { useAppStore } from '../lib/store';

const inExpoGo = Constants.executionEnvironment === 'storeClient';

export default function DevScreen() {
  const router = useRouter();
  const [seedLoading, setSeedLoading] = useState(false);
  const triggerRefresh = useAppStore((state) => state.triggerRefresh);

  const handleSeedData = async () => {
    setSeedLoading(true);
    try {
      const now = Date.now();
      const today12pm = dayjs().hour(12).minute(0).second(0).millisecond(0).valueOf();
      const tomorrow9am = dayjs().add(1, 'day').hour(9).minute(0).second(0).millisecond(0).valueOf();
      const nextWeek = dayjs().add(7, 'day').hour(14).minute(0).second(0).millisecond(0).valueOf();
      const yesterday = dayjs().subtract(1, 'day').hour(15).minute(0).second(0).millisecond(0).valueOf();

      // Overdue task
      await createTask({
        title: 'Overdue: Review quarterly report',
        notes: 'This should appear in the Overdue list',
        status: 'todo',
        priority: 3,
        due_at: yesterday,
        start_at: null,
        all_day: 0,
        list_id: null,
        repeat_rule: null,
        timezone: null,
        remind_at: yesterday,
        snooze_until: null,
        completed_at: null,
      });

      // Today task
      const todayTask = await createTask({
        title: 'Pay water bill',
        notes: 'Due today at noon',
        status: 'todo',
        priority: 2,
        due_at: today12pm,
        start_at: null,
        all_day: 0,
        list_id: null,
        repeat_rule: null,
        timezone: null,
        remind_at: today12pm,
        snooze_until: null,
        completed_at: null,
      });
      await scheduleTaskNotification(todayTask.id, todayTask.title, today12pm);
      // Tomorrow task
      await createTask({
        title: 'Call mom next Tuesday 7pm',
        notes: null,
        status: 'todo',
        priority: 1,
        due_at: tomorrow9am,
        start_at: null,
        all_day: 0,
        list_id: null,
        repeat_rule: null,
        timezone: null,
        remind_at: tomorrow9am,
        snooze_until: null,
        completed_at: null,
      });

      // Next week task
      await createTask({
        title: 'Dentist appointment',
        notes: 'Remember to bring insurance card',
        status: 'todo',
        priority: 2,
        due_at: nextWeek,
        start_at: null,
        all_day: 0,
        list_id: null,
        repeat_rule: null,
        timezone: null,
        remind_at: nextWeek - 3600000, // 1 hour before
        snooze_until: null,
        completed_at: null,
      });

      // Timeless tasks
      await createTask({
        title: 'Buy light bulbs',
        notes: null,
        status: 'todo',
        priority: 0,
        due_at: null,
        start_at: null,
        all_day: 0,
        list_id: null,
        repeat_rule: null,
        timezone: null,
        remind_at: null,
        snooze_until: null,
        completed_at: null,
      });

      await createTask({
        title: 'Read "Atomic Habits"',
        notes: 'Recommended by Sarah',
        status: 'todo',
        priority: 1,
        due_at: null,
        start_at: null,
        all_day: 0,
        list_id: null,
        repeat_rule: null,
        timezone: null,
        remind_at: null,
        snooze_until: null,
        completed_at: null,
      });

      // Completed task
      await createTask({
        title: 'Morning workout',
        notes: null,
        status: 'done',
        priority: 0,
        due_at: null,
        start_at: null,
        all_day: 0,
        list_id: null,
        repeat_rule: null,
        timezone: null,
        remind_at: null,
        snooze_until: null,
        completed_at: now,
      });

      triggerRefresh();
      Alert.alert('Success', '7 sample tasks created!');
    } catch (error) {
      console.error('Error seeding data:', error);
      Alert.alert('Error', 'Failed to seed data');
    } finally {
      setSeedLoading(false);
    }
  };

  const handleClearDatabase = () => {
    Alert.alert(
      'Clear Database',
      'Are you sure you want to delete all data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await clearDatabase();
            await cancelAllTaskNotifications();
            triggerRefresh();
            Alert.alert('Success', 'Database cleared!');
          },
        },
      ]
    );
  };

  const handleListNotifications = async () => {
    if (inExpoGo) {
      Alert.alert('Not Available', 'Notifications are not supported in Expo Go (SDK 53+)');
      return;
    }
    
    try {
      const Notifications = await import('expo-notifications');
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      Alert.alert(
        'Scheduled Notifications',
        scheduled.length > 0
          ? `${scheduled.length} notifications scheduled:\n\n${scheduled.map((n: any) => n.content.title).join('\n')}`
          : 'No notifications scheduled'
      );
    } catch {
      Alert.alert('Error', 'Failed to list notifications');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dev Tools</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Database</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleSeedData}
            disabled={seedLoading}
          >
            <Text style={styles.buttonText}>
              {seedLoading ? 'Seeding...' : 'Seed Sample Tasks'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={handleClearDatabase}
          >
            <Text style={[styles.buttonText, styles.buttonTextDanger]}>
              Clear All Data
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <TouchableOpacity style={styles.button} onPress={handleListNotifications}>
            <Text style={styles.buttonText}>List Scheduled Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={async () => {
              await cancelAllTaskNotifications();
              Alert.alert('Success', 'All notifications cancelled');
            }}
          >
            <Text style={[styles.buttonText, styles.buttonTextDanger]}>
              Cancel All Notifications
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Info</Text>
          <Text style={styles.infoText}>Timezone: {dayjs.tz.guess()}</Text>
          <Text style={styles.infoText}>Now: {dayjs().format('YYYY-MM-DD HH:mm:ss')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDanger: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D0021B',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDanger: {
    color: '#D0021B',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});
