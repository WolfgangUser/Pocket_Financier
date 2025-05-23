import { createContext, useReducer, ReactNode, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

// Define transaction type
export type Transaction = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
};

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense' | 'both';
};

// Define state type
type TransactionsState = {
  transactions: Transaction[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
};

// Define action types
type TransactionsAction =
  | { type: 'FETCH_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'FETCH_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Define context type
type TransactionsContextType = {
  transactions: Transaction[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
};

// Create initial state
const initialState: TransactionsState = {
  transactions: [],
  categories: [],
  isLoading: false,
  error: null,
};

// Create context
export const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

// Create reducer
function transactionsReducer(state: TransactionsState, action: TransactionsAction): TransactionsState {
  switch (action.type) {
    case 'FETCH_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        isLoading: false,
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction => 
          transaction.id === action.payload.id ? action.payload : transaction
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => 
          transaction.id !== action.payload
        ),
      };
    case 'FETCH_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Create provider
export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(transactionsReducer, initialState);
  const { user } = useAuth();

  // Load initial data from localStorage
  useEffect(() => {
    const loadInitialData = () => {
      try {
        if (user) {
          // Load user-specific transactions
          const storedTransactions = localStorage.getItem(`transactions_${user.id}`);
          if (storedTransactions) {
            dispatch({ 
              type: 'FETCH_TRANSACTIONS', 
              payload: JSON.parse(storedTransactions) 
            });
          }

          // Load categories
          const storedCategories = localStorage.getItem('categories');
          if (storedCategories) {
            dispatch({ 
              type: 'FETCH_CATEGORIES', 
              payload: JSON.parse(storedCategories) 
            });
          } else {
            // Initialize with default categories if none exist
            dispatch({ 
              type: 'FETCH_CATEGORIES', 
              payload: defaultCategories 
            });
            localStorage.setItem('categories', JSON.stringify(defaultCategories));
          }
        } else {
          // Clear transactions when no user is logged in
          dispatch({ type: 'FETCH_TRANSACTIONS', payload: [] });
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Failed to load transactions. Please try again.' 
        });
      }
    };

    loadInitialData();
  }, [user]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(state.transactions));
    }
  }, [state.transactions, user]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(state.categories));
  }, [state.categories]);

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };

    dispatch({
      type: 'ADD_TRANSACTION',
      payload: newTransaction,
    });
  };

  // Update a transaction
  const updateTransaction = (transaction: Transaction) => {
    dispatch({
      type: 'UPDATE_TRANSACTION',
      payload: transaction,
    });
  };

  // Delete a transaction
  const deleteTransaction = (id: string) => {
    dispatch({
      type: 'DELETE_TRANSACTION',
      payload: id,
    });
  };

  // Add a new category
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };

    dispatch({
      type: 'ADD_CATEGORY',
      payload: newCategory,
    });
  };

  return (
    <TransactionsContext.Provider
      value={{
        ...state,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

// Default categories
const defaultCategories: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#FF5630', icon: 'utensils', type: 'expense' },
  { id: '2', name: 'Transportation', color: '#FFAB00', icon: 'car', type: 'expense' },
  { id: '3', name: 'Housing', color: '#36B37E', icon: 'home', type: 'expense' },
  { id: '4', name: 'Entertainment', color: '#6554C0', icon: 'film', type: 'expense' },
  { id: '5', name: 'Shopping', color: '#00B8D9', icon: 'shopping-bag', type: 'expense' },
  { id: '6', name: 'Health', color: '#FF8B00', icon: 'heartbeat', type: 'expense' },
  { id: '7', name: 'Utilities', color: '#6B778C', icon: 'bolt', type: 'expense' },
  { id: '8', name: 'Salary', color: '#36B37E', icon: 'wallet', type: 'income' },
  { id: '9', name: 'Investments', color: '#00B8D9', icon: 'chart-line', type: 'income' },
  { id: '10', name: 'Gifts', color: '#6554C0', icon: 'gift', type: 'income' },
  { id: '11', name: 'Other Income', color: '#FF8B00', icon: 'money-bill', type: 'income' },
];