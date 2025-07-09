import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginResData } from '@/interfaces';

interface AuthState {
  user: LoginResData | null;
  loginStore: (user: LoginResData) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      loginStore: async (userData) => {
        set({ user: userData });
      },

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
