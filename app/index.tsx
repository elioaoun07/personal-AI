import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Localization from 'expo-localization';
import dayjs from 'dayjs';
// import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Disabled for Expo Go
import { QuickAdd } from '../components/QuickAdd';
import { TaskRow } from '../components/TaskRow';
import { EmptyState } from '../components/EmptyState';
import {
  Task,
  getOverdueTasks,
  getTodayTasks,
  getWeekTasks,
  getTimelessTasks,
  getAllTasks,
} from '../lib/repo/tasks';
import { useAppStore } from '../lib/store';
import { setupNotificationListeners } from '../lib/notify';

type TabType = 'overdue' | 'today' | 'week' | 'timeless' | 'all';

export default function HomeScreen() {
  // Show web message if running on web
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.webContainer}>
          <Text style={styles.webTitle}>📱 Native App Only</Text>
          <Text style={styles.webMessage}>
            This app uses SQLite database which requires a native environment.
          </Text>
          <Text style={styles.webInstructions}>
            To run the app:{'\n\n'}
            • Press 'a' in the terminal for Android emulator{'\n'}
            • Press 'i' in the terminal for iOS simulator{'\n'}
            • Scan the QR code with Expo Go app on your phone
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTrigger = useAppStore((state) => state.refreshTrigger);

  const userTimezone = Localization.getCalendars()[0]?.timeZone || 'UTC';

  useEffect(() => {
    setupNotificationListeners();
  }, []);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const now = Date.now();
      const startOfDay = dayjs().startOf('day').valueOf();
      const endOfDay = dayjs().endOf('day').valueOf();
      const startOfWeek = dayjs().startOf('week').valueOf();
      const endOfWeek = dayjs().endOf('week').valueOf();

      let loadedTasks: Task[] = [];

      switch (activeTab) {
        case 'overdue':
          loadedTasks = await getOverdueTasks(now);
          break;
        case 'today':
          loadedTasks = await getTodayTasks(startOfDay, endOfDay);
          break;
        case 'week':
          loadedTasks = await getWeekTasks(startOfWeek, endOfWeek);
          break;
        case 'timeless':
          loadedTasks = await getTimelessTasks();
          break;
        case 'all':
          loadedTasks = await getAllTasks();
          break;
      }

      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks, refreshTrigger]);

  const handleTaskPress = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TaskRow
      task={item}
      onPress={() => handleTaskPress(item.id)}
      onRefresh={loadTasks}
    />
  );

  const keyExtractor = (item: Task) => item.id;

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'overdue':
        return 'No overdue tasks! 🎉';
      case 'today':
        return 'Nothing due today. Enjoy your day!';
      case 'week':
        return 'Your week is clear!';
      case 'timeless':
        return 'No tasks without due dates.';
      case 'all':
        return 'No tasks yet. Add your first one above!';
      default:
        return 'No tasks';
    }
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" translucent={false} />
      <SafeAreaView style={styles.container}>
        <QuickAdd userTimezone={userTimezone} onTaskCreated={loadTasks} />

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overdue' && styles.tabActive]}
            onPress={() => setActiveTab('overdue')}
          >
            <Text style={[styles.tabText, activeTab === 'overdue' && styles.tabTextActive]}>
              Overdue
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'today' && styles.tabActive]}
            onPress={() => setActiveTab('today')}
          >
            <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>
              Today
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'week' && styles.tabActive]}
            onPress={() => setActiveTab('week')}
          >
            <Text style={[styles.tabText, activeTab === 'week' && styles.tabTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'timeless' && styles.tabActive]}
            onPress={() => setActiveTab('timeless')}
          >
            <Text style={[styles.tabText, activeTab === 'timeless' && styles.tabTextActive]}>
              Timeless
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              All
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={keyExtractor}
          contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : undefined}
          ListEmptyComponent={
            !isLoading ? <EmptyState message={getEmptyMessage()} /> : null
          }
          refreshing={isLoading}
          onRefresh={loadTasks}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
  },
  // Web-only styles
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  webTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  webMessage: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  webInstructions: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});