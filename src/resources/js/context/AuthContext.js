import { createContext, useState, useEffect } from 'react';
import axios from '../config/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/check');
        setUser(response.data.user);
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const updateUser = (newUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...newUserData
    }));
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 