// src/screens/ExpenseScreen.js
// Main screen for managing expenses
// Author: thethirdapprentice

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import ExpenseInput from '../components/ExpenseInput';
import ExpenseItem from '../components/ExpenseItem';
import { addExpense, deleteExpense, getAllExpenses } from '../services/expenseService';

export default function ExpenseScreen() {
  const [expenses, setExpenses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load expenses on mount
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const allExpenses = await getAllExpenses();
    setExpenses(allExpenses);
  };

  // Calculate total
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Handle add expense
  const handleAddExpense = async (amount, category, description) => {
    await addExpense(amount, category, description);
    await loadExpenses(); 
    // Refresh list
  };

  // Handle delete expense
  const handleDeleteExpense = async (id) => {
    await deleteExpense(id);
    await loadExpenses(); 
    // Refresh list
  };

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadExpenses();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💰 Expense Tracker</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Spent:</Text>
          <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      <ExpenseInput onAddExpense={handleAddExpense} />

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExpenseItem expense={item} onDelete={handleDeleteExpense} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No expenses yet. Add one above!</Text>
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
  },
  totalContainer: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});