import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
// import { Swipeable } from 'react-native-gesture-handler'; // Disabled for Expo Go
// import Animated, { FadeIn } from 'react-native-reanimated'; // Disabled for Expo Go
import { CheckCircle2, Circle, Clock } from 'lucide-react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Task } from '../lib/repo/tasks';
import { completeTask } from '../lib/repo/tasks'; // snoozeTask disabled for Expo Go
import * as Haptics from 'expo-haptics';

dayjs.extend(relativeTime);

interface TaskRowProps {
  task: Task;
  onPress: () => void;
  onRefresh: () => void;
}

const PRIORITY_COLORS = {
  0: '#999',
  1: '#4A90E2',
  2: '#F5A623',
  3: '#D0021B',
};

export const TaskRow = memo(({ task, onPress, onRefresh }: TaskRowProps) => {
  const handleComplete = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await completeTask(task.id);
    onRefresh();
  };

  // Snooze handlers (disabled for Expo Go, will work in development builds)
  // const handleSnooze30m = async () => {
  //   const snoozeUntil = Date.now() + 30 * 60 * 1000;
  //   await snoozeTask(task.id, snoozeUntil);
  //   onRefresh();
  // };

  // const handleSnoozeTonight = async () => {
  //   const tonight = dayjs().hour(20).minute(0).second(0).millisecond(0).valueOf();
  //   await snoozeTask(task.id, tonight);
  //   onRefresh();
  // };

  // const handleSnoozeTomorrow = async () => {
  //   const tomorrow = dayjs().add(1, 'day').hour(9).minute(0).second(0).millisecond(0).valueOf();
  //   await snoozeTask(task.id, tomorrow);
  //   onRefresh();
  // };

  const isOverdue = task.due_at && task.due_at < Date.now() && task.status === 'todo';
  const priorityColor = PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS[0];

  return (
    <View>
      <TouchableOpacity
        style={[styles.container, isOverdue ? styles.overdueContainer : null]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <TouchableOpacity onPress={handleComplete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          {task.status === 'done' ? (
            <CheckCircle2 size={24} color="#34C759" />
          ) : (
            <Circle size={24} color={priorityColor} />
          )}
        </TouchableOpacity>

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              task.status === 'done' && styles.titleDone,
              isOverdue ? styles.titleOverdue : null,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {task.due_at && (
            <View style={styles.metadata}>
              <Clock size={14} color={isOverdue ? '#D0021B' : '#999'} />
              <Text style={[styles.dueText, isOverdue ? styles.overdueText : null]}>
                {dayjs(task.due_at).fromNow()}
              </Text>
            </View>
          )}
        </View>

        {task.priority > 0 && (
          <View
            style={[
              styles.priorityDot,
              { backgroundColor: priorityColor },
            ]}
          />
        )}
      </TouchableOpacity>
    </View>
  );
});

TaskRow.displayName = 'TaskRow';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  overdueContainer: {
    backgroundColor: '#FFF5F5',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  titleOverdue: {
    color: '#D0021B',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dueText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 4,
  },
  overdueText: {
    color: '#D0021B',
    fontWeight: '600',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  snoozeButton: {
    backgroundColor: '#F5A623',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  actionText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
  completeButton: {
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  completeText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 15,
  },
});
