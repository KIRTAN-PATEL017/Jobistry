import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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

      {/* Desktop Sidebar - visible on md and above */}
      <div className="hidden md:block fixed left-0 top-0 w-64 h-full bg-white shadow-md z-30">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Toggle Button */}
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
        <div className="fixed inset-0 z-50 md:hidden transition duration-300">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-50"
            onClick={() => setShowMobileSidebar(false)}
          ></div>

          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg">
            <Sidebar isMobile onCloseMobileSidebar={() => setShowMobileSidebar(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-14 md:pl-64 min-h-screen">
        <div className="container mx-auto my-[-18px] px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
