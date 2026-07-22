import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  const isDark = useColorScheme() === 'dark';
  const baseClass = isDark 
    ? 'bg-[#0F172A]/80 border border-slate-700/50 shadow-black/20' 
    : 'bg-white/90 border border-slate-200/50 shadow-slate-200/50';
    
  return (
    <View 
      className={`rounded-3xl p-6 shadow-lg backdrop-blur-2xl ${baseClass} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
