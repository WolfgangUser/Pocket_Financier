import { Navigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';
import Header from './Header';

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  // If not authenticated and not loading, redirect to login
  if (!isLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // If still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mx-auto max-w-7xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}