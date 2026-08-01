import React from 'react';
import { View, Text, useColorScheme } from 'react-native';

export default function VendorsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className={`flex-1 items-center justify-center ${isDark ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
      <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Vendors</Text>
      <Text className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Vendor management coming soon in Phase 4.</Text>
    </View>
  );
}
