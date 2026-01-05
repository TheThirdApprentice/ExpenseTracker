// src/screens/DashboardScreen.js
// Dashboard with auto-refresh when tab is focused
// Author: thethirdapprentice 

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MonthlyChart from '../components/MonthlyChart';
import StatsCard from '../components/StatsCard';
import { getAllExpenses } from '../services/expenseService';
import { getCurrentUser } from '../services/authService';
import {
  getMonthlyChartData,
  getCurrentMonthExpenses,
  calculateAverageSpending,
  predictNextMonth,
  isAboveAverage,
  getCurrentMonth,
  getMonthName
} from '../utils/calculations';

export default function DashboardScreen() {
  const [expenses, setExpenses] = useState([]);
  const [hasShownAlert, setHasShownAlert] = useState(false);
  const [userName, setUserName] = useState('');

  // Reload expenses when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadExpenses();
    }, [])
  );

  const loadExpenses = async () => {
    const allExpenses = await getAllExpenses();
    setExpenses(allExpenses);
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserName(user.displayName || user.email || 'User');
    } else {
      setUserName('');
    }
  }, []);

  // Calculate stats
  const chartData = getMonthlyChartData(expenses);
  const currentMonthExpenses = getCurrentMonthExpenses(expenses);
  const currentTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageSpending = calculateAverageSpending(expenses);
  const predictedNext = predictNextMonth(expenses);
  const aboveAverageCheck = isAboveAverage(expenses);
  const { month } = getCurrentMonth();

  // Show alert if above average (only once per session)
  useEffect(() => {
    if (aboveAverageCheck.isAbove && !hasShownAlert && currentTotal > 0) {
      Alert.alert(
        '⚠️ Spending Alert',
        `You're ${aboveAverageCheck.percentage.toFixed(0)}% above your average monthly spending!\n\nCurrent: $${currentTotal.toFixed(2)}\nAverage: $${averageSpending.toFixed(2)}`,
        [{ text: 'OK', onPress: () => setHasShownAlert(true) }]
      );
    }
  }, [aboveAverageCheck.isAbove, currentTotal]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>💰 Dashboard</Text>
          {userName ? (
            <Text style={styles.user}>Welcome, {userName}</Text>
          ) : null}
          <Text style={styles.subtitle}>{getMonthName(month)}</Text>
        </View>

        <MonthlyChart data={chartData} />

        <View style={styles.statsGrid}>
          <StatsCard
            title="Current Month"
            value={currentTotal}
            subtitle={`${currentMonthExpenses.length} expenses`}
            color="#2196F3"
            alert={aboveAverageCheck.isAbove}
          />

          <StatsCard
            title="Average Spending"
            value={averageSpending}
            subtitle="Last 6 months"
            color="#4CAF50"
          />

          <StatsCard
            title="Predicted Next Month"
            value={predictedNext}
            subtitle="Based on trends"
            color="#FF9800"
          />
        </View>

        {aboveAverageCheck.isAbove && (
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>💡 Tip</Text>
            <Text style={styles.warningText}>
              You're spending ${Math.abs(aboveAverageCheck.difference).toFixed(2)} more than usual this month. 
              Consider reviewing your expenses!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  user: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginTop: 6,
  },
  statsGrid: {
    padding: 20,
    paddingTop: 0,
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 5,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});