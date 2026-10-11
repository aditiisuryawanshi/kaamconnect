import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../../services/apiClient';
import { User, UserRole } from '../../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; phone?: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  addRole: (role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kaamconnect_token'));
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('kaamconnect_active_role') as UserRole) || 'customer';
  });
  const [isLoading, setIsLoading] = useState(true);

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    localStorage.setItem('kaamconnect_active_role', role);
  };

  const refreshUser = async () => {
    const curToken = localStorage.getItem('kaamconnect_token');
    if (!curToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiRequest<User>('/auth/me');
      setUser(res.data);
      if (res.data.roles && res.data.roles.length > 0) {
        // If current activeRole is not in user roles, switch to primary role
        const curRole = localStorage.getItem('kaamconnect_active_role') as UserRole;
        if (!curRole || !res.data.roles.includes(curRole)) {
          setActiveRole(res.data.roles[0]);
        }
      }
    } catch {
      localStorage.removeItem('kaamconnect_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    localStorage.setItem('kaamconnect_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    if (res.data.user.roles && res.data.user.roles.length > 0) {
      setActiveRole(res.data.user.roles[0]);
    }
  };

  const register = async (data: { name: string; email: string; phone?: string; password: string; role: string }) => {
    const res = await apiRequest<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    localStorage.setItem('kaamconnect_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    setActiveRole(data.role as UserRole);
  };

  const logout = () => {
    localStorage.removeItem('kaamconnect_token');
    localStorage.removeItem('kaamconnect_active_role');
    setToken(null);
    setUser(null);
    setActiveRoleState('customer');
  };

  const addRole = async (role: string) => {
    const res = await apiRequest<{ token: string; roles: UserRole[] }>('/auth/roles', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    localStorage.setItem('kaamconnect_token', res.data.token);
    setToken(res.data.token);
    await refreshUser();
    setActiveRole(role as UserRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeRole,
        setActiveRole,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        addRole,
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
