import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiList, FiPieChart, FiTarget, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
      {/* Logo and app name */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-700">
        <motion.div 
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary-500 text-white font-bold mr-2">
            F
          </div>
          <span className="text-xl font-semibold text-neutral-900 dark:text-white">PocketFin</span>
        </motion.div>
      </div>
      
      {/* User info */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center">
          <img 
            src={user?.avatar || 'https://i.pravatar.cc/150?u=default'} 
            alt={user?.name || 'User'}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-white">{user?.name}</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{user?.email}</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
        <ul className="px-2 space-y-1">
          <li>
            <NavLink to="/dashboard" className={({isActive}) => 
              `nav-link ${isActive ? 'active' : ''}`
            }>
              <FiHome className="nav-link-icon" />
              Дашборд
            </NavLink>
          </li>
          <li>
            <NavLink to="/transactions" className={({isActive}) => 
              `nav-link ${isActive ? 'active' : ''}`
            }>
              <FiList className="nav-link-icon" />
              Транзакции
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className={({isActive}) => 
              `nav-link ${isActive ? 'active' : ''}`
            }>
              <FiPieChart className="nav-link-icon" />
              Отчетность
            </NavLink>
          </li>
          <li>
            <NavLink to="/budget" className={({isActive}) => 
              `nav-link ${isActive ? 'active' : ''}`
            }>
              <FiTarget className="nav-link-icon" />
              Бюджет
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({isActive}) => 
              `nav-link ${isActive ? 'active' : ''}`
            }>
              <FiSettings className="nav-link-icon" />
              Настройки
            </NavLink>
          </li>
        </ul>
      </nav>
      
      {/* Logout button */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <button 
          onClick={logout}
          className="flex items-center w-full px-4 py-2.5 text-neutral-700 dark:text-neutral-300 rounded-lg transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <FiLogOut className="mr-3 text-lg opacity-80" />
          Выйти
        </button>
      </div>
    </aside>
  );
}