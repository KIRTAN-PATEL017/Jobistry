import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  MessageSquare, 
  Briefcase, 
  FileText, 
  DollarSign,
  Star, 
  Bell, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home size={20} /> 
    },
    { 
      name: 'Profile', 
      path: `/profile/${user?.id}`, 
      icon: <User size={20} /> 
    },
    { 
      name: 'Messages', 
      path: '/messages', 
      icon: <MessageSquare size={20} /> 
    },
    { 
      name: user?.role === 'client' ? 'Projects' : 'Proposals', 
      path: user?.role === 'client' ? `/projects/client/${user?.id}` : `/proposals/${user?.id}`, 
      icon: <Briefcase size={20} /> 
    },
    { 
      name: 'Contracts', 
      path: '/contracts', 
      icon: <FileText size={20} /> 
    },
    { 
      name: 'Payments', 
      path: '/payments', 
      icon: <DollarSign size={20} /> 
    },
    { 
      name: 'Reviews', 
      path: '/reviews', 
      icon: <Star size={20} /> 
    },
    { 
      name: 'Notifications', 
      path: '/notifications', 
      icon: <Bell size={20} /> 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings size={20} /> 
    },
  ];

  return (
    <aside 
      className={`fixed h-screen bg-white shadow-lg transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      } hidden md:block`}
    >
      <div className="h-full flex flex-col">
        {/* Header with collapse button */}
        <div className={`flex items-center p-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && <span className="text-xl font-bold text-primary-600">Jobistry</span>}
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* User info */}
        <div className={`flex items-center p-4 border-t border-b border-gray-100 ${collapsed ? 'justify-center' : ''}`}>
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover" 
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <User size={20} className="text-primary-600" />
            </div>
          )}

          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center py-2 px-3 rounded-md
                    ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}
                    ${collapsed ? 'justify-center' : ''}
                    transition-colors
                  `}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={logout}
            className={`
              flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100
              ${collapsed ? 'justify-center w-full' : ''}
              transition-colors
            `}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;