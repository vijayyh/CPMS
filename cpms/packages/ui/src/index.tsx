import React from 'react';
import { View, Text } from 'react-native';

export function GradientBox() {
  return (
    <View className="p-8 bg-blue-500 rounded-xl shadow-lg border-2 border-blue-400 items-center justify-center m-4">
      <Text className="text-white text-xl font-bold">Hello from Universal UI!</Text>
      <Text className="text-blue-100 mt-2 text-center">
        This component is rendered using NativeWind and React Native Web.
      </Text>
    </View>
  );
}
