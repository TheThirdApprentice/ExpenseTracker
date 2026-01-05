import db from '../database/database';
import { getCurrentUser } from './authService';

// Ensure schema has user scoping and backfill existing rows to current user
export const ensureUserScopedSchemaAndBackfill = async (userId) => {
  try {
    const cols = await db.getAllAsync("PRAGMA table_info('expenses')");
    const hasUserId = cols?.some?.(c => c.name === 'userId');
    if (!hasUserId) {
      await db.execAsync('ALTER TABLE expenses ADD COLUMN userId TEXT');
    }
    if (userId) {
      await db.runAsync('UPDATE expenses SET userId = ? WHERE userId IS NULL', [userId]);
    }
  } catch (e) {
    console.error('Schema/backfill error:', e);
  }
};

// Add new expense
export const addExpense = async (amount, category, description) => {
  try {
    const user = getCurrentUser();
    const userId = user?.uid || 'anonymous';
    await ensureUserScopedSchemaAndBackfill(userId);
    const result = await db.runAsync(
      'INSERT INTO expenses (amount, category, description, createdAt, userId) VALUES (?, ?, ?, ?, ?)',
      [parseFloat(amount), category, description, Date.now(), userId]
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
    const user = getCurrentUser();
    const userId = user?.uid || 'anonymous';
    await ensureUserScopedSchemaAndBackfill(userId);
    const allRows = await db.getAllAsync('SELECT * FROM expenses WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    return allRows;
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

// Delete expense
export const deleteExpense = async (id) => {
  try {
    const user = getCurrentUser();
    const userId = user?.uid || 'anonymous';
    await ensureUserScopedSchemaAndBackfill(userId);
    await db.runAsync('DELETE FROM expenses WHERE id = ? AND userId = ?', [id, userId]);
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// Get total amount
export const getTotalAmount = async () => {
  try {
    const user = getCurrentUser();
    const userId = user?.uid || 'anonymous';
    await ensureUserScopedSchemaAndBackfill(userId);
    const result = await db.getFirstAsync('SELECT SUM(amount) as total FROM expenses WHERE userId = ?', [userId]);
    return result?.total || 0;
  } catch (error) {
    console.error('Error getting total:', error);
    return 0;
  }
};

// Danger: clear all local expenses for the current user only
export const clearCurrentUserExpenses = async () => {
  try {
    const user = getCurrentUser();
    const userId = user?.uid || 'anonymous';
    await ensureUserScopedSchemaAndBackfill(userId);
    await db.runAsync('DELETE FROM expenses WHERE userId = ?', [userId]);
    return true;
  } catch (error) {
    console.error('Error clearing current user expenses:', error);
    throw error;
  }
};