/**
 * Get current month and year
 */
export const getCurrentMonth = () => {
  const date = new Date();
  return {
    month: date.getMonth(), // 0-11
    year: date.getFullYear()
  };
};

/**
 * Get month name from month number
 */
export const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
};

/**
 * Group expenses by month
 */
export const groupExpensesByMonth = (expenses) => {
  const grouped = {};
  
  expenses.forEach(expense => {
    const date = new Date(expense.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(expense);
  });
  
  return grouped;
};

/**
 * Calculate total for a specific month
 */
export const getMonthTotal = (expenses, month, year) => {
  return expenses
    .filter(expense => {
      const date = new Date(expense.createdAt);
      return date.getMonth() === month && date.getFullYear() === year;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
};

/**
 * Get expenses for current month
 */
export const getCurrentMonthExpenses = (expenses) => {
  const { month, year } = getCurrentMonth();
  return expenses.filter(expense => {
    const date = new Date(expense.createdAt);
    return date.getMonth() === month && date.getFullYear() === year;
  });
};

/**
 * Calculate average monthly spending (last 6 months)
 */
export const calculateAverageSpending = (expenses) => {
  const monthlyTotals = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 6; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const total = getMonthTotal(expenses, month, year);
    if (total > 0) {
      monthlyTotals.push(total);
    }
  }
  
  if (monthlyTotals.length === 0) return 0;
  
  const sum = monthlyTotals.reduce((acc, val) => acc + val, 0);
  return sum / monthlyTotals.length;
};

/**
 * Get monthly data for chart (last 6 months)
 */
export const getMonthlyChartData = (expenses) => {
  const data = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const total = getMonthTotal(expenses, month, year);
    
    data.push({
      month: getMonthName(month).substring(0, 3), // Jan, Feb, etc.
      amount: total,
      fullMonth: getMonthName(month),
      year: year
    });
  }
  
  return data;
};

/**
 * Predict next month spending (average of last 3 months)
 */
export const predictNextMonth = (expenses) => {
  const monthlyTotals = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 3; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const total = getMonthTotal(expenses, month, year);
    monthlyTotals.push(total);
  }
  
  if (monthlyTotals.length === 0) return 0;
  
  const sum = monthlyTotals.reduce((acc, val) => acc + val, 0);
  return sum / monthlyTotals.length;
};

/**
 * Check if current spending is above average
 */
export const isAboveAverage = (expenses) => {
  const currentTotal = getCurrentMonthExpenses(expenses)
    .reduce((sum, expense) => sum + expense.amount, 0);
  const average = calculateAverageSpending(expenses);
  
  return {
    isAbove: currentTotal > average,
    difference: currentTotal - average,
    percentage: average > 0 ? ((currentTotal - average) / average * 100) : 0
  };
};