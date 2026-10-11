import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { DemoUser, Role } from '../../types';
import { storage, STORAGE_KEYS } from '../../lib/storage';
import { getDemoUserByRole } from '../../data/demoUsers';

interface AuthContextType {
  currentUser: DemoUser | null;
  login: (role: Role) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(() =>
    storage.get<DemoUser | null>(STORAGE_KEYS.currentUser, null)
  );

  useEffect(() => {
    storage.set(STORAGE_KEYS.currentUser, currentUser);
  }, [currentUser]);

  const login = (role: Role) => {
    const user = getDemoUserByRole(role);
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    storage.remove(STORAGE_KEYS.currentUser);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: currentUser !== null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
