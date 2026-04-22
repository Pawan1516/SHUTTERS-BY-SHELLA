import { useState, createContext, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const userInfo = localStorage.getItem('adminInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (err) {
      return null;
    }
  });

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setAdmin(data);
      localStorage.setItem('adminInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error('Login failed', error);
      return { success: false, error: error.message === 'Network Error' ? 'Cannot connect to backend server. Is it running?' : (error.response?.data?.message || 'Invalid email or password') };
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminInfo');
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
