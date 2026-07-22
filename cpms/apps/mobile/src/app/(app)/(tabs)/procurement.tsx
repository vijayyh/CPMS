import React from 'react';
import { View, Text, useColorScheme } from 'react-native';

export default function ProcurementScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className={`flex-1 items-center justify-center ${isDark ? 'bg-[#0B0F19]' : 'bg-[#FDFDFE]'}`}>
      <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Procurement Coming Soon</Text>
    </View>
  );
}
