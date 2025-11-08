'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

type User = {
  username: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('nutrivision-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('nutrivision-user');
    }
    setLoading(false);
  }, []);

  const login = (username: string) => {
    const newUser = { username };
    try {
      localStorage.setItem('nutrivision-user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Failed to save user to localStorage', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('nutrivision-user');
      localStorage.removeItem('food-analysis-history');
      setUser(null);
    } catch (error) {
      console.error('Failed to clear localStorage', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.replace('/login');
    }
  }, [auth, router]);

  return auth;
}
