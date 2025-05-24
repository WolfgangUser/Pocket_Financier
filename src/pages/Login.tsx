import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showHint, setShowHint] = useState(false);
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleDemoLogin = async () => {
    setEmail('demo@example.com');
    setPassword('password');
    setShowHint(false);
    await login('demo@example.com', 'password');
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Добро пожаловать!
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Войдите в аккаунт, чтобы продолжить
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-error-50 dark:bg-error-900/30 text-error-600 dark:text-error-400 rounded-lg flex items-start"
        >
          <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="form-label">
            Почта
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiMail className="text-neutral-500 dark:text-neutral-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input pl-10"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
            >
              Нужна подсказка?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiLock className="text-neutral-500 dark:text-neutral-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input pl-10"
              placeholder="Enter your password"
              required
            />
          </div>

          {showHint && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 text-sm text-neutral-600 dark:text-neutral-400"
            >
              Используйте demo@example.com / password для входа
            </motion.p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Выполняется вход...
              </span>
            ) : (
              'Войти'
            )}
          </button>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn btn-secondary w-full"
          >
            Зайти через гостевой аккаунт
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-neutral-600 dark:text-neutral-400">
          Нет аккаунта?{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}