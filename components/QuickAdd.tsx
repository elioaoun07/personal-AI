import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Plus } from 'lucide-react-native';
import { parseQuickAdd, getChipDates } from '../lib/quickParse';
import { createTask, addTagToTask } from '../lib/repo/tasks';
import { scheduleTaskNotification } from '../lib/notify';
import { useAppStore } from '../lib/store';

interface QuickAddProps {
  userTimezone?: string;
  onTaskCreated?: () => void;
}

export function QuickAdd({ userTimezone, onTaskCreated }: QuickAddProps) {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const triggerRefresh = useAppStore((state) => state.triggerRefresh);

  const handleSubmit = async () => {
    if (!input.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const parsed = parseQuickAdd(input, userTimezone);

      const task = await createTask({
        title: parsed.title,
        notes: null,
        status: 'todo',
        priority: parsed.priority,
        due_at: parsed.dueAt,
        start_at: null,
        all_day: 0,
        list_id: null,
        repeat_rule: null,
        timezone: userTimezone || null,
        remind_at: parsed.dueAt,
        snooze_until: null,
        completed_at: null,
      });

      // Add tags
      for (const tag of parsed.tags) {
        await addTagToTask(task.id, tag);
      }

      // Schedule notification
      if (parsed.dueAt) {
        await scheduleTaskNotification(task.id, parsed.title, parsed.dueAt);
      }

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setInput('');
      triggerRefresh();
      onTaskCreated?.();
    } catch (error) {
      console.error('Error creating task:', error);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChipPress = async (dueAt: number) => {
    if (!input.trim()) return;

    setIsSubmitting(true);
    try {
      const task = await createTask({
        title: input.trim(),
        notes: null,
        status: 'todo',
        priority: 0,
        due_at: dueAt,
        start_at: null,
        all_day: 0,
        list_id: null,
        repeat_rule: null,
        timezone: userTimezone || null,
        remind_at: dueAt,
        snooze_until: null,
        completed_at: null,
      });

      await scheduleTaskNotification(task.id, input.trim(), dueAt);

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setInput('');
      triggerRefresh();
      onTaskCreated?.();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const chips = getChipDates(userTimezone);

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a task… (e.g., 'Pay water bill tomorrow 9am #home !high')"
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          editable={!isSubmitting}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleSubmit}
          disabled={isSubmitting || !input.trim()}
        >
          <Plus size={24} color={input.trim() ? '#007AFF' : '#CCC'} />
        </TouchableOpacity>
      </View>

      {input.trim().length > 0 && (
        <View style={styles.chipsContainer}>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => handleChipPress(chips.today)}
            disabled={isSubmitting}
          >
            <Text style={styles.chipText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => handleChipPress(chips.tonight)}
            disabled={isSubmitting}
          >
            <Text style={styles.chipText}>Tonight</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => handleChipPress(chips.tomorrow)}
            disabled={isSubmitting}
          >
            <Text style={styles.chipText}>Tomorrow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => handleChipPress(chips.nextWeek)}
            disabled={isSubmitting}
          >
            <Text style={styles.chipText}>Next Week</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginRight: 8,
  },
  addButton: {
    padding: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
  },
  chipText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
});
