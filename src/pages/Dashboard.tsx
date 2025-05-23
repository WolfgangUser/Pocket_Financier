import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import {
  FiDollarSign,
  FiPlusCircle,
  FiMinusCircle,
  FiCalendar,
  FiPieChart,
} from 'react-icons/fi';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { useTransactions } from '../hooks/useTransactions';
import TransactionForm from '../components/transactions/TransactionForm';

export default function Dashboard() {
  const { transactions, categories } = useTransactions();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Date range for filtering
  const dateRange = {
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  };

  // Filter transactions for current month
  const monthTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = parseISO(transaction.date);
      return isWithinInterval(transactionDate, dateRange);
    });
  }, [transactions, dateRange]);

  // Calculate summary data
  const summaryData = useMemo(() => {
    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses,
      expensesByCategory: getCategoryData(monthTransactions, 'expense'),
      incomeByCategory: getCategoryData(monthTransactions, 'income'),
    };
  }, [monthTransactions]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Group transactions by category
  function getCategoryData(transactions: any[], type: 'income' | 'expense') {
    const filteredTransactions = transactions.filter(t => t.type === type);
    const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += amount;
      return acc;
    }, {});

    // Convert to array format for charts
    return Object.entries(categoryTotals).map(([name, value]) => {
      const categoryInfo = categories.find(c => c.name === name) || { 
        color: type === 'income' ? '#36B37E' : '#FF5630', 
        icon: 'circle' 
      };
      
      return {
        name,
        value,
        color: categoryInfo.color,
      };
    });
  }

  // Get month name for display
  const currentMonthName = format(currentMonth, 'MMMM yyyy');

  // Change month handler
  const changeMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  // Get recent transactions
  const recentTransactions = [...monthTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Determine colors for summary cards
  const getBalanceColor = () => {
    if (summaryData.balance > 0) return 'text-accent-500 dark:text-accent-400';
    if (summaryData.balance < 0) return 'text-error-500 dark:text-error-400';
    return 'text-neutral-700 dark:text-neutral-300';
  };

  // Daily expense data for the bar chart
  const dailyExpenseData = useMemo(() => {
    const days = Array.from(
      { length: endOfMonth(currentMonth).getDate() },
      (_, i) => i + 1
    );

    return days.map(day => {
      const dayStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTotal = monthTransactions
        .filter(t => t.type === 'expense' && t.date.startsWith(dayStr))
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        day: day.toString(),
        amount: dayTotal
      };
    });
  }, [monthTransactions, currentMonth]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <div className="space-y-6">
      {/* Page title and month selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Financial Overview
        </h1>
        
        <div className="flex items-center bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-1">
          <button
            onClick={() => changeMonth('prev')}
            className="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors"
          >
            &larr;
          </button>
          <div className="px-4 flex items-center">
            <FiCalendar className="mr-2 text-neutral-500 dark:text-neutral-400" />
            <span className="text-neutral-900 dark:text-white font-medium">
              {currentMonthName}
            </span>
          </div>
          <button
            onClick={() => changeMonth('next')}
            className="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors"
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income card */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card flex items-center"
        >
          <div className="mr-4 flex items-center justify-center w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-500 dark:text-accent-400">
            <FiPlusCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Total Income
            </p>
            <p className="text-2xl font-semibold text-accent-600 dark:text-accent-400">
              {formatCurrency(summaryData.income)}
            </p>
          </div>
        </motion.div>

        {/* Expenses card */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card flex items-center"
        >
          <div className="mr-4 flex items-center justify-center w-12 h-12 rounded-full bg-error-100 dark:bg-error-900/30 text-error-500 dark:text-error-400">
            <FiMinusCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Total Expenses
            </p>
            <p className="text-2xl font-semibold text-error-600 dark:text-error-400">
              {formatCurrency(summaryData.expenses)}
            </p>
          </div>
        </motion.div>

        {/* Balance card */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card flex items-center"
        >
          <div className="mr-4 flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400">
            <FiDollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Current Balance
            </p>
            <p className={`text-2xl font-semibold ${getBalanceColor()}`}>
              {formatCurrency(summaryData.balance)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by category chart */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-white flex items-center">
              <FiPieChart className="mr-2 text-neutral-500 dark:text-neutral-400" />
              Expenses by Category
            </h2>
          </div>
          
          <div className="h-64">
            {summaryData.expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summaryData.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {summaryData.expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-neutral-500 dark:text-neutral-400">
                  No expense data for this month
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Daily expenses chart */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-white flex items-center">
              <FiCalendar className="mr-2 text-neutral-500 dark:text-neutral-400" />
              Daily Expenses
            </h2>
          </div>
          
          <div className="h-64">
            {dailyExpenseData.some(d => d.amount > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day" 
                    tickFormatter={(tick) => Number(tick) % 5 === 1 ? tick : ''}
                  />
                  <YAxis 
                    tickFormatter={(tick) => `$${tick}`}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(label) => `Day ${label}`}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="#FF5630"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-neutral-500 dark:text-neutral-400">
                  No expense data for this month
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent transactions */}
      <motion.div
        custom={5}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="card"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">
            Recent Transactions
          </h2>
          <button
            onClick={() => setShowTransactionForm(true)}
            className="btn btn-primary btn-sm"
          >
            Add Transaction
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-left text-xs font-medium uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-750">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-2 text-sm text-neutral-900 dark:text-white">
                      {transaction.description}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300">
                        {transaction.category}
                      </span>
                    </td>
                    <td className={`px-4 py-2 whitespace-nowrap text-sm font-medium text-right ${
                      transaction.type === 'income' 
                        ? 'text-accent-600 dark:text-accent-400' 
                        : 'text-error-600 dark:text-error-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-neutral-500 dark:text-neutral-400">
              No transactions for this month yet.
            </p>
            <button
              onClick={() => setShowTransactionForm(true)}
              className="mt-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
            >
              Add your first transaction
            </button>
          </div>
        )}
      </motion.div>

      {/* Transaction form modal */}
      {showTransactionForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setShowTransactionForm(false)}
            ></motion.div>

            {/* Modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white dark:bg-neutral-800 rounded-lg w-full max-w-md p-6 shadow-xl text-left"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                  Add Transaction
                </h3>
                <button
                  onClick={() => setShowTransactionForm(false)}
                  className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              
              <TransactionForm onClose={() => setShowTransactionForm(false)} />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}