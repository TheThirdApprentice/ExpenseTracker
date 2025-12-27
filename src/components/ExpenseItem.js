// src/components/ExpenseItem.js
// Display component for single expense
// Author: ibtyssam

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ExpenseItem({ expense, onDelete }) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
        <Text style={styles.category}>{expense.category}</Text>
      </View>
      
      <View style={styles.middleSection}>
        <Text style={styles.description}>{expense.description}</Text>
        <Text style={styles.date}>
          {new Date(expense.createdAt).toLocaleDateString()}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => onDelete(expense.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftSection: {
    marginRight: 15,
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  middleSection: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});