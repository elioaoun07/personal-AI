import { create } from 'zustand'

interface AppState {
  isLoading: boolean
  user: null | { id: string; email: string }
  theme: 'light' | 'dark'
  setLoading: (loading: boolean) => void
  setUser: (user: null | { id: string; email: string }) => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useAppStore = create<AppState>()((set) => ({
  isLoading: false,
  user: null,
  theme: 'light',
  setLoading: (loading) => set({ isLoading: loading }),
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
}))