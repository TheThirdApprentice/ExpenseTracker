

import { ref, set, get } from 'firebase/database';
import { firebaseDB } from '../config/firebaseConfig';
import { getAllExpenses } from './expenseService';
import { getCurrentUser } from './authService';
import db from '../database/database';

/**
 * Backup all expenses to Firebase
 */
export const backupToCloud = async () => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    const uid = user.uid;
    // Get all expenses from SQLite
    const expenses = await getAllExpenses();
    
    // Create backup object with timestamp
    const backup = {
      expenses: expenses,
      timestamp: Date.now(),
      count: expenses.length
    };
    
    // Save to Firebase using per-user path
    const backupRef = ref(firebaseDB, `backup/${uid}`);
    await set(backupRef, backup);
    
    return {
      success: true,
      count: expenses.length,
      timestamp: backup.timestamp
    };
  } catch (error) {
    console.error('Backup error:', error);
    throw new Error('Failed to backup to cloud: ' + error.message);
  }
};

/**
 * Restore expenses from Firebase
 */
export const restoreFromCloud = async () => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    const uid = user.uid;
    // Get backup from Firebase
    const backupRef = ref(firebaseDB, `backup/${uid}`);
    const snapshot = await get(backupRef);
    
    if (!snapshot.exists()) {
      throw new Error('No backup found in cloud');
    }
    
    const backup = snapshot.val();
    const cloudExpenses = backup.expenses || [];
    
    if (cloudExpenses.length === 0) {
      return {
        success: true,
        count: 0,
        message: 'No expenses in backup'
      };
    }
    
    // Clear local expenses for this user only
    await db.runAsync('DELETE FROM expenses WHERE userId = ?', [uid]);
    
    // Insert all expenses from backup
    for (const expense of cloudExpenses) {
      await db.runAsync(
        'INSERT INTO expenses (id, amount, category, description, createdAt, userId) VALUES (?, ?, ?, ?, ?, ?)',
        [expense.id, expense.amount, expense.category, expense.description, expense.createdAt, uid]
      );
    }
    
    return {
      success: true,
      count: cloudExpenses.length,
      timestamp: backup.timestamp
    };
  } catch (error) {
    console.error('Restore error:', error);
    throw new Error('Failed to restore from cloud: ' + error.message);
  }
};

/**
 * Get last backup info
 */
export const getLastBackupInfo = async () => {
  try {
    const user = getCurrentUser();
    if (!user) return null;
    const uid = user.uid;
    const backupRef = ref(firebaseDB, `backup/${uid}`);
    const snapshot = await get(backupRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    const backup = snapshot.val();
    return {
      timestamp: backup.timestamp,
      count: backup.count,
      date: new Date(backup.timestamp).toLocaleString()
    };
  } catch (error) {
    console.error('Error getting backup info:', error);
    return null;
  }
};

/**
 * Check if cloud backup exists
 */
export const hasCloudBackup = async () => {
  try {
    const user = getCurrentUser();
    if (!user) return false;
    const uid = user.uid;
    const backupRef = ref(firebaseDB, `backup/${uid}`);
    const snapshot = await get(backupRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking backup:', error);
    return false;
  }
};