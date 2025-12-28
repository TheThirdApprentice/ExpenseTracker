

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';

import DashboardScreen from '../screens/DashboardScreen';
import ExpenseScreen from '../screens/ExpenseScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: 5,
            height: Platform.OS === 'ios' ? 85 : 70,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
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
          name="Add Expense" 
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}