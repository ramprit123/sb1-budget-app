import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Chrome as Home, ChartPie as PieChart, ChartBar as BarChart3, Settings } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';

export default function TabLayout() {
  const { colors } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: Platform.OS === 'ios' ? colors.border : 'transparent',
          elevation: Platform.OS === 'android' ? 4 : 0,
          shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingHorizontal: 16,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingTop: 8,
          borderRadius: 12,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => <PieChart size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />
        }}
      />
    </Tabs>
  );
}