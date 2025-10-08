import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import dayjs from 'dayjs';
import { CalendarStrip } from '../../components/CalendarStrip';
import { TaskRow } from '../../components/TaskRow';
import { EmptyState } from '../../components/EmptyState';
import { Task, getTodayTasks } from '../../lib/repo/tasks';
import { useAppStore } from '../../lib/store';

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(Date.now());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const refreshTrigger = useAppStore((state) => state.refreshTrigger);

  useEffect(() => {
    loadTasksForDate();
  }, [selectedDate, refreshTrigger]);

  const loadTasksForDate = async () => {
    setIsLoading(true);
    try {
      const startOfDay = dayjs(selectedDate).startOf('day').valueOf();
      const endOfDay = dayjs(selectedDate).endOf('day').valueOf();
      const tasksForDay = await getTodayTasks(startOfDay, endOfDay);
      setTasks(tasksForDay);
    } catch (error) {
      console.error('Error loading tasks for date:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskPress = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };

  const handleAddTask = () => {
    router.push('/');
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TaskRow
      task={item}
      onPress={() => handleTaskPress(item.id)}
      onRefresh={loadTasksForDate}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
      </View>

      <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <View style={styles.dateHeader}>
        <Text style={styles.dateTitle}>
          {dayjs(selectedDate).format('MMMM D, YYYY')}
        </Text>
        <Text style={styles.taskCount}>
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </Text>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={
          !isLoading ? <EmptyState message="No tasks for this date" /> : null
        }
        refreshing={isLoading}
        onRefresh={loadTasksForDate}
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddTask}>
        <Plus size={28} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  dateHeader: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskCount: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});
