// src/components/MonthlyChart.js
// Bar chart showing monthly expenses
// Author: thethirdapprentice

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MonthlyChart({ data }) {
  // Find max value for scaling
  const maxValue = Math.max(...data.map(d => d.amount), 100);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Expenses (Last 6 Months)</Text>
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.bar}>
            <View style={styles.barWrapper}>
              <View 
                style={[
                  styles.barFill, 
                  { height: `${(item.amount / maxValue) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.amount}>${item.amount.toFixed(0)}</Text>
            <Text style={styles.month}>{item.month}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingTop: 20,
  },
  bar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barWrapper: {
    width: '80%',
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: '#4CAF50',
    width: '100%',
    borderRadius: 5,
  },
  amount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  month: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
});