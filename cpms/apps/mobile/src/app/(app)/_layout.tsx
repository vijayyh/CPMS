import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme, Platform, View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../core/authStore';
import CustomDrawerContent from '../../components/layout/CustomDrawerContent';

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#0B0F19' : '#FDFDFE' }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: isDark ? '#05070A' : '#F8FAFC',
          width: 280,
        },
      }}
    >
      <Drawer.Screen 
        name="(tabs)" 
        options={{
          drawerLabel: 'Home',
          title: 'Home',
        }} 
      />
    </Drawer>
  );
}
