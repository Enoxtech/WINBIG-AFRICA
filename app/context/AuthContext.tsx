'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Lightweight JWT expiry check without external dependency
function isTokenExpired(token: string): boolean {
  try {
    const payloadB64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(payloadB64));
    const now = Date.now() / 1000;
    return !!(payload.exp && payload.exp < now);
  } catch {
    return true; // treat invalid tokens as expired
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('wb_token');
    const storedUser = localStorage.getItem('wb_user');

    if (storedToken && storedUser) {
      try {
        // Validate JWT is not expired
        if (isTokenExpired(storedToken)) {
          // Token expired — clear and stay logged out
          localStorage.removeItem('wb_token');
          localStorage.removeItem('wb_user');
        } else {
          // Valid token — load user from localStorage
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
        }
      } catch {
        // Invalid token — clear and stay logged out
        localStorage.removeItem('wb_token');
        localStorage.removeItem('wb_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('wb_token', token);
    localStorage.setItem('wb_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('wb_token');
    localStorage.removeItem('wb_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
