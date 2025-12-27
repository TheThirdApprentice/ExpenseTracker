import * as SQLite from 'expo-sqlite';

// Open database
const db = SQLite.openDatabaseSync('expenses.db');

// Initialize database tables
export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        createdAt INTEGER NOT NULL
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default db;import * as SQLite from 'expo-sqlite';
