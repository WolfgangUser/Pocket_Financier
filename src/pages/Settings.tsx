import { useState } from 'react';
import { FiSettings, FiUser, FiMail, FiLock, FiLogOut, FiSun, FiMoon, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useTransactions } from '../hooks/useTransactions';
import type { Category } from '../context/TransactionsContext';

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { categories, addCategory } = useTransactions();
  
  const [profileTab, setProfileTab] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    color: '#3366FF',
    icon: 'tag',
    type: 'expense',
  });
  
  // Colors for category selection
  const categoryColors = [
    '#3366FF', // Primary blue
    '#36B37E', // Accent green
    '#FFAB00', // Warning orange
    '#FF5630', // Error red
    '#6554C0', // Purple
    '#00B8D9', // Teal
    '#FF8B00', // Orange
    '#6B778C', // Gray
  ];
  
  // Handle category form submission
  const handleAddCategory = () => {
    if (newCategory.name) {
      addCategory(newCategory);
      setNewCategory({
        name: '',
        color: '#3366FF',
        icon: 'tag',
        type: 'expense',
      });
      setIsAddingCategory(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <FiSettings className="h-6 w-6 text-primary-500 mr-2" />
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Настройки
        </h1>
      </div>

      <p className="text-neutral-600 dark:text-neutral-400">
        Управляйте настройками
      </p>

      {/* Settings tabs */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
        <div className="flex border-b border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setProfileTab(true)}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              profileTab
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Профиль
          </button>
          <button
            onClick={() => setProfileTab(false)}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              !profileTab
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Категории
          </button>
        </div>

        <div className="p-6">
          {/* Profile tab */}
          {profileTab ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6 flex flex-col sm:flex-row items-center">
                <img
                  src={user?.avatar || 'https://i.pravatar.cc/150?u=default'}
                  alt={user?.name || 'User'}
                  className="w-24 h-24 rounded-full mb-4 sm:mb-0 sm:mr-6"
                />
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
                    {user?.name}
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Theme toggle */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
                    Тема
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {theme === 'dark' ? (
                        <FiMoon className="h-5 w-5 text-neutral-600 dark:text-neutral-400 mr-2" />
                      ) : (
                        <FiSun className="h-5 w-5 text-neutral-600 dark:text-neutral-400 mr-2" />
                      )}
                      <span className="text-neutral-900 dark:text-white">
                        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                      </span>
                    </div>
                    <button 
                      onClick={toggleTheme}
                      className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      style={{
                        backgroundColor: theme === 'dark' ? '#3366FF' : '#E5E7EB',
                      }}
                    >
                      <span
                        className={`${
                          theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                      />
                    </button>
                  </div>
                </div>

                {/* Account section */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
                    Аккаунт
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="form-label">Полное имя</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiUser className="text-neutral-500 dark:text-neutral-400" />
                        </div>
                        <input
                          id="name"
                          type="text"
                          className="form-input pl-10"
                          placeholder="Enter your name"
                          value={user?.name || ''}
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="form-label">Почта</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiMail className="text-neutral-500 dark:text-neutral-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          className="form-input pl-10"
                          placeholder="Enter your email"
                          value={user?.email || ''}
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="form-label">Пароль</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiLock className="text-neutral-500 dark:text-neutral-400" />
                        </div>
                        <input
                          id="password"
                          type="password"
                          className="form-input pl-10"
                          placeholder="••••••••"
                          value="password"
                          readOnly
                        />
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        В тестовой версии нельзя изменить пароль.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout button */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
                    Сессия
                  </h3>
                  <button
                    onClick={logout}
                    className="btn bg-error-500 text-white hover:bg-error-600 focus:ring-error-500"
                  >
                    <FiLogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Categories tab */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                  Категории транзакций
                </h3>
                <button
                  onClick={() => setIsAddingCategory(!isAddingCategory)}
                  className="btn btn-primary btn-sm"
                >
                  {isAddingCategory ? 'Cancel' : 'Add Category'}
                </button>
              </div>

              {/* Add category form */}
              {isAddingCategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-750 rounded-lg"
                >
                  <h4 className="text-md font-medium text-neutral-900 dark:text-white mb-4">
                    Создать новую категорию
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="categoryName" className="form-label">
                        Название категории
                      </label>
                      <input
                        id="categoryName"
                        type="text"
                        className="form-input"
                        placeholder="e.g., Groceries, Rent, Salary"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">
                        Тип категории
                      </label>
                      <div className="flex border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          className={`flex-1 py-2 ${
                            newCategory.type === 'expense'
                              ? 'bg-error-500 text-white font-medium'
                              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          }`}
                          onClick={() => setNewCategory({ ...newCategory, type: 'expense' })}
                        >
                          Траты
                        </button>
                        <button
                          type="button"
                          className={`flex-1 py-2 ${
                            newCategory.type === 'income'
                              ? 'bg-accent-500 text-white font-medium'
                              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          }`}
                          onClick={() => setNewCategory({ ...newCategory, type: 'income' })}
                        >
                          Доходы
                        </button>
                        <button
                          type="button"
                          className={`flex-1 py-2 ${
                            newCategory.type === 'both'
                              ? 'bg-primary-500 text-white font-medium'
                              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          }`}
                          onClick={() => setNewCategory({ ...newCategory, type: 'both' })}
                        >
                          Оба
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="form-label">
                        Цвет категории
                      </label>
                      <div className="grid grid-cols-8 gap-2">
                        {categoryColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              newCategory.color === color ? 'ring-2 ring-offset-2 ring-primary-500' : ''
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setNewCategory({ ...newCategory, color })}
                          >
                            {newCategory.color === color && (
                              <FiCheck className="text-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleAddCategory}
                      disabled={!newCategory.name}
                      className="btn btn-primary"
                    >
                      Добавить категорию
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Categories list */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-md font-medium text-neutral-900 dark:text-white mb-2">
                      Категории трат
                    </h4>
                    <div className="space-y-2">
                      {categories
                        .filter(cat => cat.type === 'expense' || cat.type === 'both')
                        .map(category => (
                          <div 
                            key={category.id}
                            className="flex items-center p-2 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                          >
                            <div 
                              className="w-4 h-4 rounded-full mr-3" 
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-neutral-900 dark:text-white">
                              {category.name}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-neutral-900 dark:text-white mb-2">
                      Категории доходов
                    </h4>
                    <div className="space-y-2">
                      {categories
                        .filter(cat => cat.type === 'income' || cat.type === 'both')
                        .map(category => (
                          <div 
                            key={category.id}
                            className="flex items-center p-2 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                          >
                            <div 
                              className="w-4 h-4 rounded-full mr-3" 
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-neutral-900 dark:text-white">
                              {category.name}
                            </span>
                          </div>
                        ))} 
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}