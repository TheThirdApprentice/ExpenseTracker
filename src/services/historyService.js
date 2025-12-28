import { getAllExpenses } from './expenseService';
import { groupExpensesByMonth, getMonthName } from '../utils/calculations';

/**
 * Get expenses organized by month for history view
 * Returns array of sections sorted by date (newest first)
 */
export const getExpenseHistory = async () => {
  const expenses = await getAllExpenses();
  const groupedExpenses = groupExpensesByMonth(expenses);
  
  const sections = Object.keys(groupedExpenses)
    .sort((a, b) => b.localeCompare(a)) // Sort newest first
    .map(key => {
      const [year, month] = key.split('-');
      const monthIndex = parseInt(month) - 1;
      const monthExpenses = groupedExpenses[key];
      const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      return {
        title: `${getMonthName(monthIndex)} ${year}`,
        key: key,
        total: total,
        count: monthExpenses.length,
        data: monthExpenses.sort((a, b) => b.createdAt - a.createdAt) // Newest first
      };
    });
  
  return sections;
};

/**
 * Get statistics for a specific month
 */
export const getMonthStatistics = (section) => {
  const expenses = section.data;
  
  // Group by category
  const categoryTotals = {};
  expenses.forEach(exp => {
    if (!categoryTotals[exp.category]) {
      categoryTotals[exp.category] = 0;
    }
    categoryTotals[exp.category] += exp.amount;
  });
  
  // Find top category
  const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
    categoryTotals[a] > categoryTotals[b] ? a : b
  , '');
  
  return {
    total: section.total,
    count: section.count,
    topCategory: topCategory,
    topCategoryAmount: categoryTotals[topCategory] || 0,
    categories: Object.keys(categoryTotals).length
  };
};