// src/screens/HistoryScreen.js
// History screen with auto-refresh when focused
// Author: thethirdapprentice (fixed)

import React, { useState } from 'react';
import { View, Text, SectionList, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ExpenseItem from '../components/ExpenseItem';
import { deleteExpense } from '../services/expenseService';
import { getExpenseHistory } from '../services/historyService';

export default function HistoryScreen() {
  const [sections, setSections] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Reload history when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    const history = await getExpenseHistory();
    setSections(history);
  };

  // Handle delete
  const handleDeleteExpense = async (id) => {
    await deleteExpense(id);
    await loadHistory(); // Refresh history
  };

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📅 History</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExpenseItem expense={item} onDelete={handleDeleteExpense} />
        )}
        renderSectionHeader={({ section: { title, total, count } }) => (
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>{title}</Text>
              <Text style={styles.sectionCount}>{count} expenses</Text>
            </View>
            <Text style={styles.sectionTotal}>${total.toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No expense history yet.</Text>
            <Text style={styles.emptySubtext}>Start adding expenses to see your history!</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  sectionCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  sectionTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});