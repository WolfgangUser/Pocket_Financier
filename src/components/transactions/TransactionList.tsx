import { useState } from 'react';
import { format } from 'date-fns';
import { FiEdit2, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions } from '../../hooks/useTransactions';
import { Transaction } from '../../context/TransactionsContext';
import TransactionForm from './TransactionForm';
import EmptyState from '../common/EmptyState';

export default function TransactionList() {
  const { transactions, deleteTransaction, categories } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const openTransactionForm = () => {
    setEditingTransaction({} as Transaction); // Открываем пустую форму
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      // Search term filter
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === '' || transaction.category === categoryFilter;
      
      // Type filter
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setTypeFilter('all');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<FiSearch className="h-8 w-8" />}
        title="No transactions yet"
        description="Add your first income or expense to start tracking your finances."
        action={
          <button
            onClick={openTransactionForm}
            className="btn btn-primary"
          >
            Add Transaction
          </button>
        }
      />
    );
  }

  return (
    <div>
      {/* Search and filters */}
      <div className="mb-6 bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-neutral-500" />
            </div>
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter toggle */}
          <button
            onClick={toggleFilters}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FiFilter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
        
        {/* Expanded filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category filter */}
                <div>
                  <label htmlFor="categoryFilter" className="form-label">
                    Category
                  </label>
                  <select
                    id="categoryFilter"
                    className="form-input"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Type filter */}
                <div>
                  <label htmlFor="typeFilter" className="form-label">
                    Transaction Type
                  </label>
                  <select
                    id="typeFilter"
                    className="form-input"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              </div>
              
              {/* Reset filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="btn btn-secondary"
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Transactions list */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
        {filteredTransactions.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">No transactions match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredTransactions.map((transaction) => (
                  <tr 
                    key={transaction.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                      {transaction.description}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300">
                        {transaction.category}
                      </span>
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-right ${
                      transaction.type === 'income' 
                        ? 'text-accent-600 dark:text-accent-400' 
                        : 'text-error-600 dark:text-error-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 mr-3"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-error-600 dark:text-error-400 hover:text-error-800 dark:hover:text-error-300"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit transaction modal */}
      <AnimatePresence>
        {editingTransaction && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black"
                onClick={() => setEditingTransaction(null)}
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
                    {Object.keys(editingTransaction).length > 1 ? 'Edit' : 'Add'} Transaction
                  </h3>
                  <button
                    onClick={() => setEditingTransaction(null)}
                    className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <TransactionForm 
                  transaction={Object.keys(editingTransaction).length > 1 ? editingTransaction : undefined}
                  onClose={() => setEditingTransaction(null)}
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}