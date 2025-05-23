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
    amount: 0,
    color: '#FF5630',
    icon: 'dollar-sign',
  });

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
      const { category, amount } = transaction;
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
    if (newBudget.category && newBudget.amount > 0) {
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
        amount: 0,
        color: '#FF5630',
        icon: 'dollar-sign',
      });
      setIsAddingBudget(false);
    }
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
            Budget Planner
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
            Monthly Budgets
          </h2>
          <button
            onClick={() => setIsAddingBudget(!isAddingBudget)}
            className="btn btn-primary"
          >
            {isAddingBudget ? 'Cancel' : (
              <>
                <FiPlusCircle className="h-4 w-4 mr-1" />
                Add Budget
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
              Create New Budget
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  id="category"
                  className="form-input"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  {expenseCategories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="amount" className="form-label">
                  Budget Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({ ...newBudget, amount: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleAddBudget}
                disabled={!newBudget.category || newBudget.amount <= 0}
                className="btn btn-primary"
              >
                Add Budget
              </button>
            </div>
          </motion.div>
        )}

        {/* Budget list */}
        {budgets.length > 0 ? (
          <div className="space-y-4">
            {budgets.map((budget, index) => {
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
                <div 
                  key={budget.id}
                  className="p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                >
                  {editingBudgetId === budget.id ? (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <h3 className="text-md font-medium text-neutral-900 dark:text-white">
                          Edit Budget
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
                          <label className="form-label">Category</label>
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
                          <label className="form-label">Budget Amount</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="form-input"
                            value={budget.amount}
                            onChange={(e) => handleUpdateBudget(budget.id, { amount: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          onClick={() => setEditingBudgetId(null)}
                          className="btn btn-primary"
                        >
                          <FiCheck className="h-4 w-4 mr-1" />
                          Save Changes
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
                            Budget: {formatCurrency(budget.amount)}
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
                          Spent: {formatCurrency(currentSpending)}
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
                      
                      <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                        {currentSpending > budget.amount ? (
                          <p className="text-error-600 dark:text-error-400">
                            You've exceeded your budget by {formatCurrency(currentSpending - budget.amount)}
                          </p>
                        ) : (
                          <p>
                            Remaining: {formatCurrency(budget.amount - currentSpending)}
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
              No budgets set up yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-6">
              Create budgets to track your spending and stay on top of your financial goals.
            </p>
            <button
              onClick={() => setIsAddingBudget(true)}
              className="btn btn-primary"
            >
              <FiPlusCircle className="h-4 w-4 mr-1" />
              Create Your First Budget
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
            Unbudgeted Expenses
          </h2>
          
          {Object.entries(expensesByCategory)
            .filter(([category]) => !budgets.some(budget => budget.category === category))
            .length > 0 ? (
              <div className="space-y-4">
                {Object.entries(expensesByCategory)
                  .filter(([category]) => !budgets.some(budget => budget.category === category))
                  .map(([category, amount], index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-750 rounded-lg">
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {category}
                      </span>
                      <div className="flex items-center">
                        <span className="text-neutral-900 dark:text-white font-medium mr-3">
                          {formatCurrency(amount)}
                        </span>
                        <button
                          onClick={() => {
                            setNewBudget({
                              category,
                              amount: Math.ceil(amount / 100) * 100, // Round up to nearest 100
                              color: '#FF5630',
                              icon: 'dollar-sign',
                            });
                            setIsAddingBudget(true);
                          }}
                          className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-md hover:bg-primary-200 dark:hover:bg-primary-800/30"
                        >
                          Create Budget
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-neutral-600 dark:text-neutral-400 text-center py-6">
                All your expense categories have budgets. Great job!
              </p>
            )}
        </motion.div>
      )}
    </div>
  );
}