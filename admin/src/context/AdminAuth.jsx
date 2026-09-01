import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // No token in localStorage to check anymore \u2014 the JWT lives in an
    // httpOnly cookie the browser sends automatically. The only way to
    // know if a session exists is to ask the server.
    const initAuth = async () => {
      try {
        const res = await authAPI.getMe();
        setUser(res.data);
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password);
      // The server already set the httpOnly auth cookie and the CSRF
      // cookie on this response \u2014 nothing to store manually here.
      setUser(res.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Even if the network call fails, clear local state so the UI
      // doesn't get stuck showing a logged-in view.
    }
    setUser(null);
    navigate('/admin/login');
  };

  const updateProfile = async (data) => {
    try {
      const res = await authAPI.updateProfile(data);
      setUser(res.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AdminContext.Provider value={{ user, login, logout, updateProfile, loading, isAuthenticated: !!user }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
