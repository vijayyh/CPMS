import { Platform } from 'react-native';
import { useAuthStore } from './authStore';

import Constants from 'expo-constants';

// In development, we dynamically resolve the host IP so physical devices on Wi-Fi can connect
// to the Next.js API server running on port 3000.
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      return `http://${ip}:3000`;
    }
    return Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
  }
  return 'https://your-production-url.com'; // TODO: Update with real prod URL
};

export const API_BASE_URL = getBaseUrl();

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const { sessionToken: token, sessionCookieName: cookieName } = useAuthStore.getState();

  const headers = new Headers(options.headers || {});

  // /api/auth/mobile-login returns both the session token and the exact cookie name
  // NextAuth used to encrypt it (varies by http/https), so we replay it verbatim here
  // instead of guessing.
  const existingCookies = headers.get('Cookie') || '';
  if (token && cookieName) {
    const sessionCookie = `${cookieName}=${token}`;
    headers.set('Cookie', existingCookies ? `${existingCookies}; ${sessionCookie}` : sessionCookie);
  }

  // Ensure JSON requests
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  // Handle Unauthorized globally
  if (response.status === 401) {
    useAuthStore.getState().logout();
  }

  return response;
};
