import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api/user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      setUser({ username: localStorage.getItem('username') || 'User' });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, { email, password }, config);
      setToken(res.data.token);
      setUser({ username: res.data.username });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
    } catch (err) {
      throw new Error(err.response.data.error || 'Login failed');
    }
  };

  const register = async (username, email, password) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
      const res = await axios.post(`${API_BASE_URL}/register`, { username, email, password }, config);
      setToken(res.data.token);
      setUser({ username: username }); 
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', username);
    } catch (err) {
      throw new Error(err.response.data.error || 'Registration failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);