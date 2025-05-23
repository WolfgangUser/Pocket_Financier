import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiDollarSign, FiTag, FiCalendar, FiInfo } from 'react-icons/fi';
import { useTransactions } from '../../hooks/useTransactions';
import { Transaction } from '../../context/TransactionsContext';

type TransactionFormData = Omit<Transaction, 'id'>;
type TransactionFormProps = {
  transaction?: Transaction;
  onClose: () => void;
};

export default function TransactionForm({ transaction, onClose }: TransactionFormProps) {
  const { addTransaction, updateTransaction, categories } = useTransactions();
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'expense');
  
  const { register, handleSubmit, formState: { errors } } = useForm<TransactionFormData>({
    defaultValues: transaction || {
      amount: 0,
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    const transactionData = {
      ...data,
      type, // Use the selected type from state
    };

    if (transaction) {
      updateTransaction({ ...transactionData, id: transaction.id });
    } else {
      addTransaction(transactionData);
    }
    onClose();
  };

  const filteredCategories = categories.filter(
    category => category.type === 'both' || category.type === type
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Transaction type toggle */}
      <div className="flex mb-4 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
        <button
          type="button"
          className={`flex-1 py-2.5 text-center ${
            type === 'expense' 
              ? 'bg-error-500 text-white font-medium' 
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
          onClick={() => setType('expense')}
        >
          Expense
        </button>
        <button
          type="button"
          className={`flex-1 py-2.5 text-center ${
            type === 'income' 
              ? 'bg-accent-500 text-white font-medium' 
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
          onClick={() => setType('income')}
        >
          Income
        </button>
      </div>

      <input 
        type="hidden" 
        {...register('type')} 
        value={type} 
      />

      {/* Amount */}
      <div className="mb-4">
        <label htmlFor="amount" className="form-label">
          Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiDollarSign className="text-neutral-500 dark:text-neutral-400" />
          </div>
          <input
            id="amount"
            type="number"
            step="0.01"
            className="form-input pl-10"
            placeholder="0.00"
            {...register('amount', { 
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
            })}
          />
        </div>
        {errors.amount && (
          <p className="form-error">{errors.amount.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiInfo className="text-neutral-500 dark:text-neutral-400" />
          </div>
          <input
            id="description"
            type="text"
            className="form-input pl-10"
            placeholder="What was this for?"
            {...register('description', { 
              required: 'Description is required',
              maxLength: { value: 100, message: 'Description is too long' },
            })}
          />
        </div>
        {errors.description && (
          <p className="form-error">{errors.description.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="mb-4">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiTag className="text-neutral-500 dark:text-neutral-400" />
          </div>
          <select
            id="category"
            className="form-input pl-10"
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">Select a category</option>
            {filteredCategories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {errors.category && (
          <p className="form-error">{errors.category.message}</p>
        )}
      </div>

      {/* Date */}
      <div className="mb-6">
        <label htmlFor="date" className="form-label">
          Date
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiCalendar className="text-neutral-500 dark:text-neutral-400" />
          </div>
          <input
            id="date"
            type="date"
            className="form-input pl-10"
            {...register('date', { required: 'Date is required' })}
          />
        </div>
        {errors.date && (
          <p className="form-error">{errors.date.message}</p>
        )}
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`btn ${type === 'income' ? 'bg-accent-500 hover:bg-accent-600 focus:ring-accent-500' : 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-500'} text-white`}
        >
          {transaction ? 'Update' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}
        </button>
      </div>
    </form>
  );
}