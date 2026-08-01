import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import { LayoutDashboard, Users, Package, ShoppingCart, Building2 } from 'lucide-react-native';
import { useAuthStore } from '../../../core/authStore';

if (Platform.OS === 'web') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Unknown event handler property')) {
      return;
    }
    originalConsoleError(...args);
  };
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const userRole = useAuthStore(state => state.user?.role);
  const isEmployee = userRole === 'EMPLOYEE';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6B35', // Brand primary
        tabBarInactiveTintColor: isDark ? '#64748B' : '#94A3B8',
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: -2,
        },
        tabBarStyle: {
          backgroundColor: isDark ? '#05070A' : '#ffffff',
          borderTopColor: isDark ? '#1E293B' : '#F1F5F9',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 95 : 75,
          paddingBottom: Platform.OS === 'ios' ? 30 : 15,
          paddingTop: 12,
          display: isEmployee ? 'none' : 'flex',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.2 : 0.03,
          shadowRadius: 10,
          elevation: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => <LayoutDashboard size={focused ? 28 : 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, focused }) => <Building2 size={focused ? 28 : 24} color={color} />,
          href: isEmployee ? null : '/projects',
        }}
      />
      <Tabs.Screen
        name="materials"
        options={{
          title: 'Materials',
          tabBarIcon: ({ color, focused }) => <Package size={focused ? 28 : 24} color={color} />,
          href: isEmployee ? null : '/materials',
        }}
      />
      <Tabs.Screen
        name="procurement"
        options={{
          title: 'Purchases', // Shortened title
          tabBarIcon: ({ color, focused }) => <ShoppingCart size={focused ? 28 : 24} color={color} />,
          href: isEmployee ? null : '/procurement',
        }}
      />
      <Tabs.Screen
        name="vendors"
        options={{
          title: 'Vendors',
          tabBarIcon: ({ color, focused }) => <Users size={focused ? 28 : 24} color={color} />,
          href: isEmployee ? null : '/vendors',
        }}
      />
      {/* Hide these sub-screens from the main tab bar */}
      <Tabs.Screen
        name="attendance"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="indents"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
