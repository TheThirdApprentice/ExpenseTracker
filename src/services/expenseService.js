// src/services/expenseService.js
// SQLite CRUD operations for expenses
// Author: thethirdapprentice

import db from '../database/database';

// Add new expense
export const addExpense = async (amount, category, description) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO expenses (amount, category, description, createdAt) VALUES (?, ?, ?, ?)',
      [parseFloat(amount), category, description, Date.now()]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

// Get all expenses
export const getAllExpenses = async () => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM expenses ORDER BY createdAt DESC');
    return allRows;
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

// Delete expense
export const deleteExpense = async (id) => {
  try {
    await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// Get total amount
export const getTotalAmount = async () => {
  try {
    const result = await db.getFirstAsync('SELECT SUM(amount) as total FROM expenses');
    return result?.total || 0;
  } catch (error) {
    console.error('Error getting total:', error);
    return 0;
  }
};