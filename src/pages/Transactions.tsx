import { FiList } from 'react-icons/fi';
import TransactionList from '../components/transactions/TransactionList';

export default function Transactions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <FiList className="h-6 w-6 text-primary-500 mr-2" />
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Transactions
        </h1>
      </div>

      <p className="text-neutral-600 dark:text-neutral-400">
        View, search, and manage all your transactions in one place.
      </p>

      <TransactionList />
    </div>
  );
}