import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center py-12 px-4 bg-white dark:bg-neutral-800 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </motion.div>
  );
}