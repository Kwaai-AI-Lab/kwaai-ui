import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  currentUser: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const response = await axios.get('/session', { withCredentials: true });
        console.log('Session response:', response.data); // Debugging statement
        if (response.data.user) {
          console.log('User found in session:', response.data.user);
          setCurrentUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          console.log('No user found in session response');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    console.log('currentUser state updated:', currentUser);
    console.log('isAuthenticated state updated:', isAuthenticated);
  }, [currentUser, isAuthenticated]);

  const login = async (email: string) => {
    try {
      console.log('Attempting login with email:', email);
      const response = await axios.post('/api/login', { email }, { withCredentials: true });
      console.log('Login response:', response.data);
      setCurrentUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout...');
      await axios.post('/logout', {}, { withCredentials: true });
      console.log('Logout successful');
      setIsAuthenticated(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
