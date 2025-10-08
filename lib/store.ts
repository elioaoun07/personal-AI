import { create } from 'zustand';
import { Task } from './repo/tasks';
import { CalendarEvent } from './repo/events';

interface AppState {
  isLoading: boolean;
  user: null | { id: string; email: string };
  theme: 'light' | 'dark';
  selectedDate: number | null;
  tasks: Task[];
  events: CalendarEvent[];
  refreshTrigger: number;
  setLoading: (loading: boolean) => void;
  setUser: (user: null | { id: string; email: string }) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSelectedDate: (date: number | null) => void;
  setTasks: (tasks: Task[]) => void;
  setEvents: (events: CalendarEvent[]) => void;
  triggerRefresh: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  isLoading: false,
  user: null,
  theme: 'light',
  selectedDate: null,
  tasks: [],
  events: [],
  refreshTrigger: 0,
  setLoading: (loading) => set({ isLoading: loading }),
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setTasks: (tasks) => set({ tasks }),
  setEvents: (events) => set({ events }),
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));