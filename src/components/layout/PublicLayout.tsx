import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../common/ThemeToggle';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Left side: Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>

      {/* Right side: Image with info */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 flex flex-col items-center justify-center text-white p-12">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-6">Take control of your finances</h2>
            <p className="text-xl text-primary-100 mb-8">
              Track expenses, monitor your spending habits, and achieve your financial goals with FinTrack.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Easy Tracking</h3>
                <p className="text-primary-100">Log your transactions quickly and categorize them automatically.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Smart Reports</h3>
                <p className="text-primary-100">Get insights with beautiful charts and detailed analysis.</p>
              </div>
            </div>
            <div className="text-sm text-primary-200">
              Demo credentials: demo@example.com / password
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}