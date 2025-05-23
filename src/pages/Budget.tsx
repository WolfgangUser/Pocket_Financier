import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';
import { FiTarget, FiCalendar, FiPlusCircle, FiEdit, FiTrash, FiCheck, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTransactions } from '../hooks/useTransactions';

// Budget type
type Budget = {
  id: string;
  category: string;
  amount: number;
  color: string;
  icon: string;
};

export default function Budget() {
  const { transactions, categories } = useTransactions();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const stored = localStorage.getItem('budgets');
    return stored ? JSON.parse(stored) : [];
  });
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [newBudget, setNewBudget] = useState<Omit<Budget, 'id'>>({
    category: '',
    amount: NaN,
    color: '#FF5630',
    icon: 'dollar-sign',
  });

  // Сброс формы
  const resetForm = () => {
    setNewBudget({
      category: '',
      amount: NaN,
      color: '#FF5630',
      icon: 'dollar-sign',
    });
  };

  // Date range for filtering
  const dateRange = {
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  };

  // Filter transactions for current month
  const monthTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = parseISO(transaction.date);
      return isWithinInterval(transactionDate, dateRange) && 
             transaction.type === 'expense'; // Only consider expenses for budget
    });
  }, [transactions, dateRange]);

  // Calculate expenses by category
  const expensesByCategory = useMemo(() => {
  return monthTransactions.reduce((acc, transaction) => {
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
  }, [monthTransactions]);

  // Save budgets to localStorage
  const saveBudgets = (newBudgets: Budget[]) => {
    localStorage.setItem('budgets', JSON.stringify(newBudgets));
    setBudgets(newBudgets);
  };

  // Add a new budget
  const handleAddBudget = () => {
  if (!newBudget.category) {
    alert('Please select a category.');
    return;
  }

  if (newBudget.amount <= 0) {
    alert('Please enter a valid budget amount greater than 0.');
    return;
  }

  const categoryInfo = categories.find(c => c.name === newBudget.category);

  const budgetToAdd: Budget = {
    id: Date.now().toString(),
    category: newBudget.category,
    amount: newBudget.amount,
    color: categoryInfo?.color || '#FF5630',
    icon: categoryInfo?.icon || 'dollar-sign',
  };

  const updatedBudgets = [...budgets, budgetToAdd];
  saveBudgets(updatedBudgets);

  // Reset form
  setNewBudget({
    category: '',
    amount: NaN,
    color: '#FF5630',
    icon: 'dollar-sign',
  });

  setIsAddingBudget(false);
};

  // Update an existing budget
  const handleUpdateBudget = (id: string, updatedBudget: Partial<Budget>) => {
    const updatedBudgets = budgets.map(budget => 
      budget.id === id ? { ...budget, ...updatedBudget } : budget
    );
    saveBudgets(updatedBudgets);
    setEditingBudgetId(null);
  };

  // Delete a budget
  const handleDeleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      const updatedBudgets = budgets.filter(budget => budget.id !== id);
      saveBudgets(updatedBudgets);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

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

  // Get current month name
  const currentMonthName = format(currentMonth, 'MMMM yyyy');

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

  // Filter expense categories
  const expenseCategories = categories.filter(
    category => category.type === 'expense' || category.type === 'both'
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <FiTarget className="h-6 w-6 text-primary-500 mr-2" />
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Ограничение трат
          </h1>
        </div>
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

      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="card"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">
            Бюджеты
          </h2>
          <button
            onClick={() => {
              setIsAddingBudget(!isAddingBudget);
              if (!isAddingBudget) resetForm(); // Сброс при открытии
            }}
            className="btn btn-primary"
          >
            {isAddingBudget ? 'Cancel' : (
              <>
                <FiPlusCircle className="h-4 w-4 mr-1" />
                Добавить бюджет
              </>
            )}
          </button>
        </div>


        {/* Add budget form */}
        {isAddingBudget && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg"
          >
            <h3 className="text-md font-medium text-neutral-900 dark:text-white mb-4">
              Создать новый бюджет
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="category" className="form-label">
                  Категория
                </label>
                <select
                  id="category"
                  className={`form-input ${!newBudget.category ? 'border-error-500' : ''}`}
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  required
                >
                  <option value="">Выберите категорию</option>
                  {expenseCategories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {!newBudget.category && (
                  <p className="text-error-500 text-sm mt-1">Please select a category.</p>
                )}
              </div>
              <div>
                <label htmlFor="amount" className="form-label">
                  Сумма бюджета
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  placeholder="0.00"
                  step="0.01"
                  className={`form-input ${newBudget.amount <= 0 ? 'border-error-500' : ''}`}
                  value={isNaN(newBudget.amount) || newBudget.amount === 0 ? '' : newBudget.amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = value === '' ? NaN : parseFloat(value);
                    setNewBudget({
                      ...newBudget,
                      amount: parsedValue,
                    });
                  }}
                  required
                />
                {newBudget.amount <= 0 && (
                  <p className="text-error-500 text-sm mt-1">Сумма должна быть больше 0.</p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddBudget}
                disabled={!newBudget.category || newBudget.amount <= 0}
                className="btn btn-primary"
              >
                Добавить бюджет
              </button>
            </div>
          </motion.div>
        )}

        {/* Budget list */}
        {budgets.length > 0 ? (
          <div className="space-y-4">
            {budgets.map((budget) => {
              // Calculate current spending
              const currentSpending = expensesByCategory[budget.category] || 0;
              // Calculate percentage
              const percentage = Math.min((currentSpending / budget.amount) * 100, 100);
              // Determine status color
              let statusColor = 'bg-accent-500';
              if (percentage >= 90) {
                statusColor = 'bg-error-500';
              } else if (percentage >= 70) {
                statusColor = 'bg-warning-500';
              }

              return (
                <div key={budget.id} className="p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                  {editingBudgetId === budget.id ? (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <h3 className="text-md font-medium text-neutral-900 dark:text-white">
                          Редактировать бюджет
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingBudgetId(null)}
                            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">Категория</label>
                          <select
                            className="form-input"
                            value={budget.category}
                            onChange={(e) => handleUpdateBudget(budget.id, { category: e.target.value })}
                          >
                            {expenseCategories.map(category => (
                              <option key={category.id} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Сумма</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="form-input"
                            value={budget.amount}
                            onChange={(e) =>
                              handleUpdateBudget(budget.id, { amount: parseFloat(e.target.value) || 0 })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setEditingBudgetId(null)}
                          className="btn btn-primary"
                        >
                          <FiCheck className="h-4 w-4 mr-1" />
                          Сохранить изменения
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-md font-medium text-neutral-900 dark:text-white">
                            {budget.category}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Бюджет: {formatCurrency(budget.amount)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingBudgetId(budget.id)}
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBudget(budget.id)}
                            className="text-error-600 dark:text-error-400 hover:text-error-800 dark:hover:text-error-300"
                          >
                            <FiTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-700 dark:text-neutral-300">
                          Потрачено: {formatCurrency(currentSpending)}
                        </span>
                        <span className={`font-medium ${
                          percentage >= 90 
                            ? 'text-error-600 dark:text-error-400' 
                            : percentage >= 70 
                              ? 'text-warning-600 dark:text-warning-400' 
                              : 'text-accent-600 dark:text-accent-400'
                        }`}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                        <div 
                          className={`${statusColor} h-2.5 rounded-full transition-all duration-500`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs text-neutral-900 dark:text-neutral-100">
                        {currentSpending > budget.amount ? (
                          <p className="text-error-600 dark:text-error-400">
                            Вы превысили свой бюджет на {formatCurrency(currentSpending - budget.amount)}
                          </p>
                        ) : (
                          <p>
                            Остаётся: {formatCurrency(budget.amount - currentSpending)}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
            <FiTarget className="h-12 w-12 mx-auto text-neutral-400 dark:text-neutral-500 mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
              Нет бюджетов
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-6">
              Создайте бюджет, чтобы овладеть своими финансами.
            </p>
            <button
              onClick={() => {
                setIsAddingBudget(true);
                resetForm();
              }}
              className="btn btn-primary"
            >
              <FiPlusCircle className="h-4 w-4 mr-1" />
              Создайте первый бюджет
            </button>
          </div>
        )}
      </motion.div>

      {/* Unbudgeted expenses */}
      {budgets.length > 0 && (
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card"
        >
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
            Категории неограниченные бюджетом 
          </h2>
          {Object.entries(expensesByCategory)
            .filter(([category]) => !budgets.some(budget => budget.category === category))
            .length > 0 ? (
              <div className="space-y-4">
                {Object.entries(expensesByCategory)
                  .filter(([category]) => !budgets.some(budget => budget.category === category))
                  .map(([category, amount]) => (
                    <div key={category} className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3" 
                        style={{ backgroundColor: categories.find(c => c.name === category)?.color || '#FF5630' }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {category}
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {formatCurrency(amount)} {/* Тут мы уверены, что amount — число */}
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-error-500" 
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-neutral-600 dark:text-neutral-400 text-center py-6">
                Все ваши категории трат ограничены бюджетом. Отличная работа!
              </p>
            )}
        </motion.div>
      )}
    </div>
  );
}