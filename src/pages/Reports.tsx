import { useState } from 'react';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO, getMonth, getYear } from 'date-fns';
import { FiPieChart } from 'react-icons/fi';
import { ResponsiveContainer, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { useTransactions } from '../hooks/useTransactions';

interface MonthlyData {
  month: string;
  monthKey: string;
  income: number;
  expense: number;
}

export default function Reports() {
  const { transactions, categories } = useTransactions();
  const [reportPeriod, setReportPeriod] = useState<'month' | 'threeMonths' | 'sixMonths' | 'year'>('month');
  
  // Get date range based on selected period
  const getDateRange = () => {
    const now = new Date();
    const end = endOfMonth(now);
    
    let start;
    switch (reportPeriod) {
      case 'month':
        start = startOfMonth(now);
        break;
      case 'threeMonths':
        start = startOfMonth(subMonths(now, 2));
        break;
      case 'sixMonths':
        start = startOfMonth(subMonths(now, 5));
        break;
      case 'year':
        start = startOfMonth(subMonths(now, 11));
        break;
      default:
        start = startOfMonth(now);
    }
    
    return { start, end };
  };
  
  // Filter transactions based on date range
  const dateRange = getDateRange();
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = parseISO(transaction.date);
    return isWithinInterval(transactionDate, dateRange);
  });
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Calculate summary data
  // Calculate summary data
  const summaryData = {
    income: filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (typeof t.amount === 'string' ? parseFloat(t.amount) || 0 : t.amount), 0),
    expense: filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (typeof t.amount === 'string' ? parseFloat(t.amount) || 0 : t.amount), 0),
    balance: 
      filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (typeof t.amount === 'string' ? parseFloat(t.amount) || 0 : t.amount), 0)
      -
      filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (typeof t.amount === 'string' ? parseFloat(t.amount) || 0 : t.amount), 0),
    savingsRate: 0
  };

// Пересчитаем savingsRate после баланса
summaryData.savingsRate =
  summaryData.income > 0
    ? (summaryData.balance / summaryData.income) * 100
    : 0;
  
  // Group transactions by category
  const expensesByCategory = filteredTransactions
  .filter(t => t.type === 'expense')
  .reduce((acc, transaction) => {
    const { category } = transaction;
    const amount = typeof transaction.amount === 'string'
      ? parseFloat(transaction.amount) || 0
      : transaction.amount;

    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array for pie chart
  const expensePieData = Object.entries(expensesByCategory).map(([name, value]) => {
    const categoryInfo = categories.find(c => c.name === name) || { color: '#FF5630' };
    return {
      name,
      value,
      color: categoryInfo.color,
    };
  }).sort((a, b) => b.value - a.value);
  
  // Group by month for trend chart
  const getMonthlyData = () => {
    const monthsData: MonthlyData[] = [];
    let date = new Date(dateRange.start);
    
    while (date <= dateRange.end) {
      monthsData.push({
        month: format(date, 'MMM yyyy'),
        monthKey: `${getYear(date)}-${getMonth(date)}`,
        income: 0,
        expense: 0,
      });
      date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }
    
    filteredTransactions.forEach(transaction => {
      const date = parseISO(transaction.date);
      const monthKey = `${getYear(date)}-${getMonth(date)}`;
      const monthData = monthsData.find(m => m.monthKey === monthKey);
      
      if (monthData) {
        if (transaction.type === 'income') {
          monthData.income += typeof transaction.amount === 'string'
            ? parseFloat(transaction.amount) || 0
            : transaction.amount;
        } else {
          monthData.expense += typeof transaction.amount === 'string'
            ? parseFloat(transaction.amount) || 0
            : transaction.amount;
        }
      }
    });
    
    return monthsData;
  };
  
  const monthlyData = getMonthlyData();
  
  // Card animation variants
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <FiPieChart className="h-6 w-6 text-primary-500 mr-2" />
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Финансовая отчетность
          </h1>
        </div>
        
        {/* Period selector */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-1 flex">
          <button
            onClick={() => setReportPeriod('month')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              reportPeriod === 'month'
                ? 'bg-primary-500 text-white'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            Месяц
          </button>
          <button
            onClick={() => setReportPeriod('threeMonths')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              reportPeriod === 'threeMonths'
                ? 'bg-primary-500 text-white'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            3 Месяца
          </button>
          <button
            onClick={() => setReportPeriod('sixMonths')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              reportPeriod === 'sixMonths'
                ? 'bg-primary-500 text-white'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            6 Месяцев
          </button>
          <button
            onClick={() => setReportPeriod('year')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              reportPeriod === 'year'
                ? 'bg-primary-500 text-white'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            Год
          </button>
        </div>
      </div>
      
      <p className="text-neutral-600 dark:text-neutral-400">
        Период: {format(dateRange.start, 'MMMM d, yyyy')} - {format(dateRange.end, 'MMMM d, yyyy')}
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Income card */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card"
        >
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Сумма доходов
          </p>
          <p className="text-2xl font-semibold text-accent-600 dark:text-accent-400">
            {formatCurrency(summaryData.income)}
          </p>
        </motion.div>

        {/* Expenses card */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card"
        >
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Сумма трат
          </p>
          <p className="text-2xl font-semibold text-error-600 dark:text-error-400">
            {formatCurrency(summaryData.expense)}
          </p>
        </motion.div>

        {/* Net savings card */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card"
        >
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Состояние счёта
          </p>
          <p className={`text-2xl font-semibold ${
            summaryData.balance >= 0 
              ? 'text-accent-600 dark:text-accent-400' 
              : 'text-error-600 dark:text-error-400'
          }`}>
            {formatCurrency(summaryData.balance)}
          </p>
        </motion.div>

        {/* Savings rate card */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card"
        >
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Оценка состояния счета
          </p>
          <p className={`text-2xl font-semibold ${
            summaryData.savingsRate >= 0 
              ? 'text-accent-600 dark:text-accent-400' 
              : 'text-error-600 dark:text-error-400'
          }`}>
            {summaryData.savingsRate.toFixed(1)}%
          </p>
        </motion.div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense breakdown */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card"
        >
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
            Расклад трат
          </h2>
          
          <div className="h-80">
            {expensePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    //label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {expensePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-neutral-500 dark:text-neutral-400">
                   В течении выбранного периода траты не совершались
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Income vs Expense Trend */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card"
        >
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
            Сравнение Расходов и Доходов
          </h2>
          
          <div className="h-80">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(tick) => `$${tick}`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#36B37E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expenses" fill="#FF5630" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-neutral-500 dark:text-neutral-400">
                  Нет данных за выбранный период
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Top spending categories */}
      <motion.div
        custom={6}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="card"
      >
        <h2 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
          Самые большие категории трат
        </h2>
        
        {expensePieData.length > 0 ? (
          <div className="space-y-4">
            {expensePieData.slice(0, 5).map((category, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3" 
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {category.name}
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {formatCurrency(category.value)}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(category.value / expensePieData[0].value) * 100}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400 text-center py-4">
            Нет трат за выбранный период
          </p>
        )}
      </motion.div>
    </div>
  );
}