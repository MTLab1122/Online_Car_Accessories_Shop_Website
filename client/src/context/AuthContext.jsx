import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load authenticated user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.getMe();
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        setUser(response.data);
        toast.success(`Welcome back, ${response.data.name}!`);

        // Synchronize guest cart if sessionId exists
        const sessionId = localStorage.getItem('autox_session_id');
        if (sessionId) {
          try {
            await cartService.syncCart(sessionId);
          } catch {
            // non-fatal
          }
        }
        return response.data;
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please verify credentials.');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success && response.data) {
        setUser(response.data);
        toast.success('Registration successful! Welcome to AUTOX.');

        // Synchronize guest cart if sessionId exists
        const sessionId = localStorage.getItem('autox_session_id');
        if (sessionId) {
          try {
            await cartService.syncCart(sessionId);
          } catch {
            // non-fatal
          }
        }
        return response.data;
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('You have been logged out.');
    } catch (err) {
      setUser(null);
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authService.updateProfile(data);
      if (response.success && response.data) {
        setUser(response.data);
        toast.success('Profile updated successfully.');
        return response.data;
      }
    } catch (err) {
      toast.error(err.message || 'Could not update profile.');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

