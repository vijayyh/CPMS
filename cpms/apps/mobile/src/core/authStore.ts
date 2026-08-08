import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export type UserRole = 
  | 'ADMIN'
  | 'MANAGER'
  | 'PM'
  | 'SITE_ENGINEER'
  | 'PROCUREMENT'
  | 'ACCOUNTS'
  | 'VENDOR'
  | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  sessionToken: string | null;
  sessionCookieName: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSessionToken: (token: string | null, cookieName?: string | null) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const Storage = {
  getItemAsync: async (key: string) => {
    if (Platform.OS === 'web') {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    }
    return SecureStore.getItemAsync(key);
  },
  setItemAsync: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      try { localStorage.setItem(key, value); } catch (e) {}
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  deleteItemAsync: async (key: string) => {
    if (Platform.OS === 'web') {
      try { localStorage.removeItem(key); } catch (e) {}
      return;
    }
    return SecureStore.deleteItemAsync(key);
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  sessionToken: null,
  sessionCookieName: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  setSessionToken: async (token, cookieName) => {
    if (token) {
      await Storage.setItemAsync('session_token', token);
      await Storage.setItemAsync('session_cookie_name', cookieName || 'authjs.session-token');
    } else {
      await Storage.deleteItemAsync('session_token');
      await Storage.deleteItemAsync('session_cookie_name');
    }
    set({ sessionToken: token, sessionCookieName: token ? (cookieName || 'authjs.session-token') : null });
  },

  logout: async () => {
    await Storage.deleteItemAsync('session_token');
    await Storage.deleteItemAsync('session_cookie_name');
    await Storage.deleteItemAsync('user_profile');
    set({ user: null, sessionToken: null, sessionCookieName: null });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await Storage.getItemAsync('session_token');
      const cookieName = await Storage.getItemAsync('session_cookie_name');
      const userDataStr = await Storage.getItemAsync('user_profile');

      if (token && userDataStr) {
        set({ sessionToken: token, sessionCookieName: cookieName || 'authjs.session-token', user: JSON.parse(userDataStr) });
      } else {
        set({ sessionToken: null, sessionCookieName: null, user: null });
      }
    } catch (e) {
      console.error('Error checking auth', e);
    } finally {
      set({ isLoading: false });
    }
  },
}));
