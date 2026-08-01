import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, useColorScheme } from 'react-native';
import { useAuthStore } from '../../../core/authStore';
import { fetchApi } from '../../../core/api';
import { Card } from '../../../components/ui/Card';
import { SymbolView } from 'expo-symbols';

export default function AttendanceScreen() {
  const user = useAuthStore(state => state.user);
  const isDark = useColorScheme() === 'dark';
  const [loading, setLoading] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    // Fetch today's attendance status
    checkStatus();
    return () => clearInterval(timer);
  }, []);

  const checkStatus = async () => {
    // In a real app, this would hit /api/attendance/status
    // For now, we mock the UI state
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      // Mimic hitting the backend API
      // const response = await fetchApi('/api/attendance/clock-in', { method: 'POST' });
      // if (response.ok) { ... }
      
      setTimeout(() => {
        setIsCheckedIn(true);
        Alert.alert("Success", "You have successfully clocked in for the day.");
        setLoading(false);
      }, 1000);
    } catch (error) {
      Alert.alert("Error", "Could not clock in. Please try again.");
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    setTimeout(() => {
      setIsCheckedIn(false);
      Alert.alert("Success", "You have successfully clocked out.");
      setLoading(false);
    }, 1000);
  };

  return (
    <ScrollView 
      className={`flex-1 ${isDark ? 'bg-[#0B0F19]' : 'bg-[#FDFDFE]'}`}
      contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 100 }}
    >
      <View className="mb-8">
        <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Attendance</Text>
        <Text className={`text-lg mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      <Card className="items-center py-10 mb-8">
        <Text className={`text-5xl font-light tracking-widest mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text className={`text-sm uppercase font-bold tracking-widest ${isCheckedIn ? 'text-emerald-500' : 'text-orange-500'}`}>
          {isCheckedIn ? 'Currently Clocked In' : 'Not Clocked In'}
        </Text>

        <TouchableOpacity 
          className={`w-48 h-48 rounded-full mt-10 items-center justify-center shadow-lg ${
            isCheckedIn 
              ? 'bg-slate-800 shadow-slate-900' 
              : 'bg-[#FF6B35] shadow-orange-500/30'
          }`}
          onPress={isCheckedIn ? handleClockOut : handleClockIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="large" />
          ) : (
            <>
              <SymbolView 
                name={isCheckedIn ? "rectangle.portrait.and.arrow.right" : "hand.tap.fill"} 
                size={40} 
                tintColor="white" 
                fallback={null} 
              />
              <Text className="text-white font-bold text-xl mt-3 uppercase tracking-widest">
                {isCheckedIn ? 'Clock Out' : 'Clock In'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </Card>

      <View>
        <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          Recent Logs
        </Text>
        
        {[1, 2, 3].map((i) => (
          <Card key={i} className="mb-3 flex-row items-center justify-between py-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 items-center justify-center mr-3">
                <SymbolView name="checkmark" size={20} tintColor="#10B981" fallback={null} />
              </View>
              <View>
                <Text className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Yesterday
                </Text>
                <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  9:00 AM - 5:30 PM
                </Text>
              </View>
            </View>
            <Text className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              8.5 hrs
            </Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
