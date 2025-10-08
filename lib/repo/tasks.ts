import { supabase } from '../supabase';
import { log } from '../log';

export type TaskStatus = 'todo' | 'done';

export interface Task {
  id: string;
  title: string;
  notes: string | null;
  status: TaskStatus;
  priority: number;
  due_at: number | null;
  start_at: number | null;
  all_day: number;
  list_id: string | null;
  repeat_rule: string | null;
  timezone: string | null;
  remind_at: number | null;
  snooze_until: number | null;
  user_id: string;
  created_at: number;
  updated_at: number;
  completed_at: number | null;
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  done: number;
  position: number;
}

export interface Tag {
  id: string;
  name: string;
}

export interface TaskWithTags extends Task {
  tags: Tag[];
}

// Create Task
export async function createTask(
  data: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<Task> {
  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      title: data.title,
      notes: data.notes,
      status: data.status,
      priority: data.priority,
      due_at: data.due_at,
      start_at: data.start_at,
      all_day: data.all_day,
      list_id: data.list_id,
      repeat_rule: data.repeat_rule,
      timezone: data.timezone,
      remind_at: data.remind_at,
      snooze_until: data.snooze_until,
      completed_at: data.completed_at,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  log('Task created:', task.id);
  
  return task as Task;
}

// Update Task
export async function updateTask(
  id: string,
  data: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>>
): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  log('Task updated:', id);
}

// Delete Task
export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }

  log('Task deleted:', id);
}

// Get Task by ID
export async function getTask(id: string): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching task:', error);
    return null;
  }

  return data as Task;
}

// Get Overdue Tasks
export async function getOverdueTasks(now: number = Date.now()): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'todo')
    .not('due_at', 'is', null)
    .lt('due_at', now)
    .order('due_at', { ascending: true });

  if (error) {
    console.error('Error fetching overdue tasks:', error);
    return [];
  }

  return (data as Task[]) || [];
}

// Get Today's Tasks
export async function getTodayTasks(
  startOfDay: number,
  endOfDay: number
): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'todo')
    .not('due_at', 'is', null)
    .gte('due_at', startOfDay)
    .lt('due_at', endOfDay)
    .order('due_at', { ascending: true });

  if (error) {
    console.error('Error fetching today tasks:', error);
    return [];
  }

  return (data as Task[]) || [];
}

// Get Week Tasks
export async function getWeekTasks(
  weekStart: number,
  weekEnd: number
): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'todo')
    .not('due_at', 'is', null)
    .gte('due_at', weekStart)
    .lt('due_at', weekEnd)
    .order('due_at', { ascending: true });

  if (error) {
    console.error('Error fetching week tasks:', error);
    return [];
  }

  return (data as Task[]) || [];
}

// Get Timeless Tasks (no due date)
export async function getTimelessTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'todo')
    .is('due_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching timeless tasks:', error);
    return [];
  }

  return (data as Task[]) || [];
}

// Get Scheduled Future Tasks
export async function getScheduledFutureTasks(now: number = Date.now()): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'todo')
    .not('due_at', 'is', null)
    .gt('due_at', now)
    .order('due_at', { ascending: true });

  if (error) {
    console.error('Error fetching future tasks:', error);
    return [];
  }

  return (data as Task[]) || [];
}

// Get Completed Tasks
export async function getCompletedTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'done')
    .order('completed_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching completed tasks:', error);
    return [];
  }

  return (data as Task[]) || [];
}

// Get All Tasks
export async function getAllTasks(): Promise<Task[]> {
  console.log('📝 Fetching all tasks from Supabase...');
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('status', { ascending: true })
    .order('due_at', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching all tasks:');
    console.error('  Message:', error.message);
    console.error('  Details:', error.details);
    console.error('  Hint:', error.hint);
    console.error('  Code:', error.code);
    console.error('  Full error:', JSON.stringify(error, null, 2));
    return [];
  }

  console.log(`✅ Successfully fetched ${data?.length || 0} tasks`);
  
  return (data as Task[]) || [];
}

// Search Tasks
export async function searchTasks(query: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'todo')
    .or(`title.ilike.%${query}%,notes.ilike.%${query}%`)
    .order('due_at', { ascending: true });

  if (error) {
    console.error('Error searching tasks:', error);
    return [];
  }

  return (data as Task[]) || [];
}

// Complete Task
export async function completeTask(id: string): Promise<void> {
  const task = await getTask(id);
  if (!task) return;

  const now = Date.now();

  // TODO: Handle recurring tasks
  // if (task.repeat_rule) { ... }

  await updateTask(id, {
    status: 'done',
    completed_at: now,
  });
}

// Snooze Task
export async function snoozeTask(id: string, snoozeUntil: number): Promise<void> {
  await updateTask(id, {
    snooze_until: snoozeUntil,
    due_at: snoozeUntil,
  });
}

// Subtasks - Note: You'll need to create a subtasks table in Supabase
export async function getSubtasks(taskId: string): Promise<Subtask[]> {
  const { data, error } = await supabase
    .from('subtasks')
    .select('*')
    .eq('task_id', taskId)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching subtasks:', error);
    return [];
  }

  return (data as Subtask[]) || [];
}

export async function createSubtask(
  taskId: string,
  title: string,
  position: number
): Promise<Subtask> {
  const { data, error } = await supabase
    .from('subtasks')
    .insert({
      task_id: taskId,
      title,
      done: 0,
      position,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating subtask:', error);
    throw error;
  }

  return data as Subtask;
}

export async function updateSubtask(
  id: string,
  data: Partial<Omit<Subtask, 'id' | 'task_id'>>
): Promise<void> {
  const { error } = await supabase
    .from('subtasks')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error('Error updating subtask:', error);
    throw error;
  }
}

export async function deleteSubtask(id: string): Promise<void> {
  const { error } = await supabase
    .from('subtasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting subtask:', error);
    throw error;
  }
}

// Tags
export async function getTaskTags(taskId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('task_tags')
    .select('tag_id, tags(id, name)')
    .eq('task_id', taskId);

  if (error) {
    console.error('Error fetching task tags:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data?.map((item: any) => item.tags).filter(Boolean) as Tag[]) || [];
}

export async function getTaskWithTags(id: string): Promise<TaskWithTags | null> {
  const task = await getTask(id);
  if (!task) return null;

  const tags = await getTaskTags(id);
  return { ...task, tags };
}
