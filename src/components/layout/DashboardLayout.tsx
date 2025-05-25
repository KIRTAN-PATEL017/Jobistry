import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  // Close mobile sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileSidebar(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Toggle */}
      <div className="fixed left-4 top-20 z-40 md:hidden">
        <button 
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="p-2 bg-white rounded-md shadow-md"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-30 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900 bg-opacity-50"
            onClick={() => setShowMobileSidebar(false)}
          ></div>
          
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 md:pl-64 min-h-screen">
        <div className="container mx-auto my-[-18px] px-4 py-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;