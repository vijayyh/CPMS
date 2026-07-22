import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useColorScheme, FlatList } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { RoleGate } from '../../../components/ui/RoleGate';
import { SymbolView } from 'expo-symbols';

// Mock data for display purposes
const MOCK_INDENTS = [
  { id: 'IND-001', project: 'Sector 43 Tech Park', status: 'APPROVED', date: '2023-10-25', items: 12 },
  { id: 'IND-002', project: 'Riverside Apartments', status: 'PENDING', date: '2023-10-26', items: 4 },
  { id: 'IND-003', project: 'City Mall Renovation', status: 'REJECTED', date: '2023-10-22', items: 2 },
];

export default function IndentsScreen() {
  const isDark = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = useState('ALL');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20';
      case 'PENDING': return 'text-orange-500 bg-orange-100 dark:bg-orange-500/20';
      case 'REJECTED': return 'text-red-500 bg-red-100 dark:bg-red-500/20';
      default: return 'text-slate-500 bg-slate-100 dark:bg-slate-800';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-500';
      case 'PENDING': return 'bg-orange-500';
      case 'REJECTED': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-[#0B0F19]' : 'bg-[#FDFDFE]'}`}>
      <View className="px-5 pt-16 pb-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Indents</Text>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-[#FF6B35] items-center justify-center shadow-lg shadow-orange-500/30">
            <SymbolView name="plus" size={20} tintColor="white" fallback={null} />
          </TouchableOpacity>
        </View>

        {/* Tab Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`mr-3 px-4 py-2 rounded-full border ${
                activeTab === tab 
                  ? 'bg-slate-800 border-slate-800 dark:bg-white dark:border-white' 
                  : `bg-transparent ${isDark ? 'border-slate-700' : 'border-slate-200'}`
              }`}
            >
              <Text className={`font-semibold text-xs ${
                activeTab === tab 
                  ? 'text-white dark:text-slate-900' 
                  : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={MOCK_INDENTS.filter(i => activeTab === 'ALL' || i.status === activeTab)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <Card className="mb-4 p-0 overflow-hidden">
            <View className="p-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.id}
                </Text>
                <View className={`flex-row items-center px-2 py-1 rounded-md ${getStatusColor(item.status)}`}>
                  <View className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(item.status)}`} />
                  <Text className="text-[10px] font-bold tracking-wider">{item.status}</Text>
                </View>
              </View>
              
              <Text className={`font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {item.project}
              </Text>
              
              <View className="flex-row justify-between items-center mt-4">
                <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.date}
                </Text>
                <Text className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {item.items} items
                </Text>
              </View>
            </View>
            
            {/* Action Bar */}
            <View className={`flex-row border-t ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50'}`}>
              <TouchableOpacity className="flex-1 py-3 items-center justify-center border-r border-slate-200 dark:border-slate-700">
                <Text className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>View Details</Text>
              </TouchableOpacity>
              
              <RoleGate allowedRoles={['ADMIN', 'PM', 'MANAGER']}>
                {item.status === 'PENDING' && (
                  <TouchableOpacity className="flex-1 py-3 items-center justify-center">
                    <Text className={`text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Approve</Text>
                  </TouchableOpacity>
                )}
              </RoleGate>
            </View>
          </Card>
        )}
      />
    </View>
  );
}
