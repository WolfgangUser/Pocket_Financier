import { Link } from 'react-router-dom';
import { FiAlertCircle, FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error-100 dark:bg-error-900/30 text-error-500 dark:text-error-400 mb-6">
          <FiAlertCircle className="h-10 w-10" />
        </div>
        
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
          Страница не найдена
        </h2>
        
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Страница отсутствует.
        </p>
        
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center btn btn-primary"
        >
          <FiHome className="h-4 w-4 mr-2" />
          Вернуться к Дашборду
        </Link>
      </motion.div>
    </div>
  );
}