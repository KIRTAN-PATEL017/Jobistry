import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
// Layouts
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Project from './pages/Project';
import CreateProject from './pages/CreateProject';
import Profile from './pages/Profile';
import UserProjects from './components/dashboard/UserProjects';
import BrowseProjects from './pages/BrowseProjects';


// Protected route component
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div className="text-center mt-10">Checking authentication...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;

};

// Main App component
const App: React.FC = () => {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes with MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          
          {/* Protected routes with DashboardLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile/:userId" element={<Profile />} />

              <Route path="/projects/client/:userId" element={<UserProjects />} />
              <Route path="/projects/:projectId" element={<Project />} />
              <Route path="/projects/browse" element={<BrowseProjects />} />

              <Route path="/post-project" element={<CreateProject />} />
            </Route>
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;