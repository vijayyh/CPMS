import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, useColorScheme, FlatList } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { SymbolView } from 'expo-symbols';

const MOCK_PROJECTS = [
  { id: '1', name: 'Sector 43 Tech Park', status: 'ACTIVE', progress: 65, tasks: 12, team: 45 },
  { id: '2', name: 'Riverside Apartments', status: 'PLANNING', progress: 15, tasks: 5, team: 12 },
  { id: '3', name: 'City Mall Renovation', status: 'ON_HOLD', progress: 40, tasks: 8, team: 20 },
];

export default function ProjectsScreen() {
  const isDark = useColorScheme() === 'dark';

  return (
    <ScrollView 
      className={`flex-1 ${isDark ? 'bg-[#0B0F19]' : 'bg-[#FDFDFE]'}`}
      contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 100 }}
    >
      <View className="mb-6">
        <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Projects</Text>
        <Text className={`text-lg mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Active sites & developments
        </Text>
      </View>

      <View className="flex-row gap-3 mb-6">
        <TouchableOpacity className="flex-1 bg-blue-100 dark:bg-blue-500/20 py-3 rounded-xl items-center">
          <Text className="text-blue-700 dark:text-blue-400 font-bold">All (3)</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-transparent border border-slate-200 dark:border-slate-700 py-3 rounded-xl items-center">
          <Text className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active (1)</Text>
        </TouchableOpacity>
      </View>

      {MOCK_PROJECTS.map((project) => (
        <Card key={project.id} className="mb-4">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1 pr-4">
              <Text className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {project.name}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {project.team} Team Members
              </Text>
            </View>
            <View className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
              <SymbolView name="building.2.fill" size={20} tintColor={isDark ? '#94A3B8' : '#64748B'} fallback={null} />
            </View>
          </View>
          
          <View className="mt-4">
            <View className="flex-row justify-between mb-2">
              <Text className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Progress
              </Text>
              <Text className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {project.progress}%
              </Text>
            </View>
            
            {/* Progress Bar */}
            <View className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <View 
                className="h-full bg-[#FF6B35]" 
                style={{ width: `${project.progress}%` }} 
              />
            </View>
          </View>
          
          <View className="flex-row justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <View className="flex-row items-center">
              <SymbolView name="checklist" size={16} tintColor={isDark ? '#94A3B8' : '#64748B'} fallback={null} />
              <Text className={`ml-2 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {project.tasks} Active Tasks
              </Text>
            </View>
            
            <TouchableOpacity>
              <Text className="text-blue-600 dark:text-blue-400 font-bold text-sm">View Details</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}
