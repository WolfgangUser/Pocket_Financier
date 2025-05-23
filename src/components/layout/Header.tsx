import { useState } from 'react';
import { FiMenu, FiPlus, FiBell, FiX } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../common/ThemeToggle';
import TransactionForm from '../transactions/TransactionForm';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const toggleTransactionForm = () => {
    setShowTransactionForm(prev => !prev);
  };

  return (
    <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center md:hidden p-2 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-white ml-2 md:ml-0">
              {window.location.pathname === '/dashboard' && 'Dashboard'}
              {window.location.pathname === '/transactions' && 'Transactions'}
              {window.location.pathname === '/reports' && 'Reports'}
              {window.location.pathname === '/budget' && 'Budget'}
              {window.location.pathname === '/settings' && 'Settings'}
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={toggleTransactionForm}
              className="btn btn-primary"
            >
              <FiPlus className="h-4 w-4 mr-1" />
              <span>Add Transaction</span>
            </button>
            
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-neutral-200 dark:border-neutral-700"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/transactions"
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Transactions
              </NavLink>
              <NavLink
                to="/reports"
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Reports
              </NavLink>
              <NavLink
                to="/budget"
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Budget
              </NavLink>
              <NavLink
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Settings
              </NavLink>
              
              <button 
                onClick={logout}
                className="w-full text-left nav-link text-error-500 hover:bg-error-50 dark:hover:bg-error-900/30"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction form modal */}
      <AnimatePresence>
        {showTransactionForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black"
                onClick={toggleTransactionForm}
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
                    onClick={toggleTransactionForm}
                    className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                
                <TransactionForm onClose={toggleTransactionForm} />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}