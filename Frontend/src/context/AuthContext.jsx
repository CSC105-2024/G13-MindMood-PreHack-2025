import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Configure axios defaults for token usage
const configureAxios = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true); // Ensure loading is true at the start
      
      const token = localStorage.getItem('token');
      
      if (token) {
        // Configure axios with the token
        configureAxios(token);
        
        try {
          // Verify token with backend
          const response = await axios.get('http://localhost:3000/auth/verify-token', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.valid) {
            console.log('Token verified successfully');
            setIsAuthenticated(true);
            setUser(response.data.user);
          } else {
            console.log('Token is invalid');
            // Token is invalid or expired
            localStorage.removeItem('token');
            configureAxios(null);
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          configureAxios(null);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        console.log('No token found');
        setIsAuthenticated(false);
        setUser(null);
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        configureAxios(response.data.token);
        setIsAuthenticated(true);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, message: response.data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'An unexpected error occurred' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    configureAxios(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  // Context value
  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;