import React, { useEffect } from 'react';
import ExpenseScreen from './src/screens/ExpenseScreen';
import { initDatabase } from './src/database/database';

export default function App() {
  useEffect(() => {
    
    initDatabase();
  }, []);

  return <ExpenseScreen />;
}