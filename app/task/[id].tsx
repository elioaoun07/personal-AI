import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Switch,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Trash2, Plus } from 'lucide-react-native';
import dayjs from 'dayjs';
import { RRule, Frequency } from 'rrule';
import {
  getTask,
  updateTask,
  deleteTask,
  getSubtasks,
  createSubtask,
  updateSubtask,
  deleteSubtask,
  Subtask,
} from '../../lib/repo/tasks';
import { useAppStore } from '../../lib/store';

export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const triggerRefresh = useAppStore((state) => state.triggerRefresh);

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState(0);
  const [dueDate, setDueDate] = useState<number | null>(null);
  const [allDay, setAllDay] = useState(false);
  const [repeatRule, setRepeatRule] = useState<string | null>(null);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    if (!id) return;
    
    const task = await getTask(id as string);
    if (task) {
      setTitle(task.title);
      setNotes(task.notes || '');
      setPriority(task.priority);
      setDueDate(task.due_at);
      setAllDay(Boolean(task.all_day));
      setRepeatRule(task.repeat_rule);
    }

    const subs = await getSubtasks(id as string);
    setSubtasks(subs);
  };

  const handleSave = async () => {
    if (!id || !title.trim()) return;

    await updateTask(id as string, {
      title,
      notes: notes || null,
      priority,
      due_at: dueDate,
      all_day: allDay ? 1 : 0,
      repeat_rule: repeatRule,
    });

    triggerRefresh();
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            await deleteTask(id as string);
            triggerRefresh();
            router.back();
          },
        },
      ]
    );
  };

  const handleAddSubtask = async () => {
    if (!id || !newSubtaskTitle.trim()) return;

    await createSubtask(id as string, newSubtaskTitle.trim(), subtasks.length);
    setNewSubtaskTitle('');
    loadTask();
  };

  const toggleSubtask = async (subtask: Subtask) => {
    await updateSubtask(subtask.id, { done: subtask.done ? 0 : 1 });
    loadTask();
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    await deleteSubtask(subtaskId);
    loadTask();
  };

  const setRepeatPreset = (preset: string) => {
    let rule: RRule;
    switch (preset) {
      case 'daily':
        rule = new RRule({ freq: Frequency.DAILY });
        break;
      case 'weekdays':
        rule = new RRule({ freq: Frequency.WEEKLY, byweekday: [0, 1, 2, 3, 4] });
        break;
      case 'weekly':
        rule = new RRule({ freq: Frequency.WEEKLY });
        break;
      case 'monthly':
        rule = new RRule({ freq: Frequency.MONTHLY });
        break;
      default:
        setRepeatRule(null);
        return;
    }
    setRepeatRule(rule.toString());
  };

  const clearDueDate = () => setDueDate(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Task</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Trash2 size={22} color="#D0021B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            autoFocus
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityButtons}>
            <TouchableOpacity
              style={[styles.priorityButton, priority === 0 && styles.priorityButtonActive]}
              onPress={() => setPriority(0)}
            >
              <Text style={styles.priorityText}>None</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.priorityButton, priority === 1 && styles.priorityButtonActive]}
              onPress={() => setPriority(1)}
            >
              <Text style={styles.priorityText}>Low</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.priorityButton, priority === 2 && styles.priorityButtonActive]}
              onPress={() => setPriority(2)}
            >
              <Text style={styles.priorityText}>Med</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.priorityButton, priority === 3 && styles.priorityButtonActive]}
              onPress={() => setPriority(3)}
            >
              <Text style={styles.priorityText}>High</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Due Date</Text>
            {dueDate && (
              <TouchableOpacity onPress={clearDueDate}>
                <Text style={styles.clearButton}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.dateDisplay}>
            {dueDate ? dayjs(dueDate).format('MMM D, YYYY h:mm A') : 'No due date'}
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>All Day</Text>
            <Switch value={allDay} onValueChange={setAllDay} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Repeat</Text>
          <View style={styles.repeatButtons}>
            <TouchableOpacity
              style={[styles.repeatButton, !repeatRule && styles.repeatButtonActive]}
              onPress={() => setRepeatPreset('none')}
            >
              <Text style={styles.repeatText}>None</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.repeatButton}
              onPress={() => setRepeatPreset('daily')}
            >
              <Text style={styles.repeatText}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.repeatButton}
              onPress={() => setRepeatPreset('weekdays')}
            >
              <Text style={styles.repeatText}>Weekdays</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.repeatButton}
              onPress={() => setRepeatPreset('weekly')}
            >
              <Text style={styles.repeatText}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.repeatButton}
              onPress={() => setRepeatPreset('monthly')}
            >
              <Text style={styles.repeatText}>Monthly</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Subtasks</Text>
          {subtasks.map((subtask) => (
            <View key={subtask.id} style={styles.subtaskRow}>
              <TouchableOpacity onPress={() => toggleSubtask(subtask)} style={styles.subtaskCheck}>
                <View style={[styles.checkbox, subtask.done ? styles.checkboxDone : null]}>
                  {subtask.done && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
              <Text style={[styles.subtaskTitle, subtask.done ? styles.subtaskTitleDone : null]}>
                {subtask.title}
              </Text>
              <TouchableOpacity onPress={() => handleDeleteSubtask(subtask.id)}>
                <X size={18} color="#999" />
              </TouchableOpacity>
            </View>
          ))}
          <View style={styles.subtaskInput}>
            <TextInput
              style={styles.subtaskField}
              value={newSubtaskTitle}
              onChangeText={setNewSubtaskTitle}
              placeholder="Add subtask..."
              onSubmitEditing={handleAddSubtask}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={handleAddSubtask}>
              <Plus size={22} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  clearButton: {
    color: '#007AFF',
    fontSize: 14,
  },
  dateDisplay: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#007AFF',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  repeatButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  repeatButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  repeatButtonActive: {
    backgroundColor: '#007AFF',
  },
  repeatText: {
    fontSize: 13,
    fontWeight: '500',
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  subtaskCheck: {
    marginRight: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtaskTitle: {
    flex: 1,
    fontSize: 15,
  },
  subtaskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  subtaskInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  subtaskField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
