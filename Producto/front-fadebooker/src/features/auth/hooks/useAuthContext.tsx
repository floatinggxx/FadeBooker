import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '@/types';
import { userService } from '@/lib/api/userService';
import { useNotification } from '@/context/NotificationContext';

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (userData: Usuario, token: string) => void;
  logout: (reason?: string) => void;
  updateUser: (userData: Partial<Usuario>) => void;
  isAuthenticated: boolean;
  sessionExpiredReason: string | null;
  clearSessionExpiredReason: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const [sessionExpiredReason, setSessionExpiredReason] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }

    const hydrateUser = async () => {
      if (storedToken && !storedUser) {
        try {
          const perfil = await userService.getPerfil();
          setUser(perfil);
          localStorage.setItem('user', JSON.stringify(perfil));
        } catch {
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    hydrateUser();
    // Sync auth state across tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') {
        setToken(e.newValue);
      }
      if (e.key === 'user') {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch { setUser(null); }
        } else {
          setUser(null);
        }
      }
      if (e.key === 'logout_reason' && e.newValue) {
        try { showNotification(e.newValue, 'warning'); } catch {}
        localStorage.removeItem('logout_reason');
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Helper: parse JWT exp and check expiry
  const isTokenExpired = (t: string | null) => {
    if (!t) return true;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      if (payload && payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        return payload.exp <= now;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Periodically validate token expiration and auto-logout if expired
  useEffect(() => {
    const interval = setInterval(() => {
      const t = localStorage.getItem('token');
      if (t && isTokenExpired(t)) {
        console.info('Sesión expirada — cerrando sesión automáticamente');
        logout('Tu sesión expiró. Por favor, inicia sesión de nuevo.');
      }
    }, 30 * 1000); // check every 30s
    return () => clearInterval(interval);
  }, []);

  const login = (userData: Usuario, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = (reason?: string) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (reason) {
      try { showNotification(reason, 'info'); } catch { /* noop */ }
      setSessionExpiredReason(reason);
    }
    // Redirect: if logout called without reason (manual logout), go to home;
    // if with reason (expiration/invalid token) prefer login screen.
    try {
      if (reason) {
        window.location.href = '/login';
      } else {
        window.location.href = '/';
      }
    } catch {}
  };

  const clearSessionExpiredReason = () => setSessionExpiredReason(null);

  const updateUser = (userData: Partial<Usuario>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  if (loading) {
    return <div className="app-loading">Cargando sesión...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated: !!token, sessionExpiredReason, clearSessionExpiredReason }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
