'use client';
import { create } from 'zustand';
import type { UserDto } from '@toeic-master/shared-types';

interface AuthStore {
  user: UserDto | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  // Actions
  setAuth: (user: UserDto, accessToken: string) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user:            null,
  accessToken:     null,
  isAuthenticated: false,
  isHydrated:      false,

  setAuth: (user, accessToken) =>
    set({ user, accessToken, isAuthenticated: true }),

  clearAuth: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),

  setHydrated: () => set({ isHydrated: true }),
}));
