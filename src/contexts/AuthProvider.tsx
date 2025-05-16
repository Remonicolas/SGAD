
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import type { User } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (username: string, pass: string) => Promise<boolean>; // Simulate async login
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user
const MOCK_USER: User = {
  id: 'user1',
  username: 'preceptor',
  name: 'Jorge Prieto',
  role: 'Preceptor',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Check initial auth status
  const router = useRouter();

  useEffect(() => {
    // Simulate checking stored auth status (e.g., from localStorage)
    const storedUser = localStorage.getItem('asistenciaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    if (username === MOCK_USER.username && pass === 'password123') { // Simple mock validation
      setUser(MOCK_USER);
      localStorage.setItem('asistenciaUser', JSON.stringify(MOCK_USER));
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('asistenciaUser');
    router.push('/login');
  };

  const value = useMemo(() => ({
    user,
    login,
    logout,
    isLoading,
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
