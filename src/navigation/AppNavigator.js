// src/navigation/AppNavigator.js
// Bottom tab navigation (main app)
// Author: ibtyssam

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';

import DashboardScreen from '../screens/DashboardScreen';
import ExpenseScreen from '../screens/ExpenseScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: Platform.OS === 'ios' ? 20 : 15,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 90 : 80,
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>📊</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Add" 
        component={ExpenseScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>➕</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>📅</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}