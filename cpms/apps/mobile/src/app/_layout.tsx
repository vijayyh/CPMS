import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../core/authStore';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, isLoading, checkAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    // We can hide the splash screen once we know the auth state
    SplashScreen.hideAsync();


    
    // Simple authentication routing logic
    if (!user && segments[0] !== 'login') {
      router.replace('/login');
    } else if (user && segments[0] === 'login') {
      router.replace('/(app)' as any);
    }
  }, [user, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#0B0F19' : '#FDFDFE' }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
      </Stack>
    </>
  );
}
