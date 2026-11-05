import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentAdminUser,
  isAdminAuthenticated,
  loginAdmin as serviceLogin,
  logoutAdmin as serviceLogout
} from '../services/adminAuthService';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentAdminUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminAuthenticated());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentAdminUser());
      setIsAuthenticated(isAdminAuthenticated());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await serviceLogin(credentials);
      setUser(result.user);
      setIsAuthenticated(true);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await serviceLogout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

export default AdminAuthContext;

