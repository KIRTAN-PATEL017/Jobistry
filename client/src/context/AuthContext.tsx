import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'freelancer';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.post('https://jobistry-api.onrender.com/api/auth/validate', {}, { withCredentials: true })
      .then((res) => {
        setIsAuthenticated(res.data.success);
        setUser(res.data.user); // If your backend returns user info
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    await axios.post('https://jobistry-api.onrender.com/api/auth/logout', {}, { withCredentials: true });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, setIsAuthenticated, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};