import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'network_admin' | 'cybersecurity_analyst' | 'system_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  'network@nita.gov': {
    id: '1',
    name: 'John Mwale',
    email: 'network@nita.gov',
    role: 'network_admin',
  },
  'security@nita.gov': {
    id: '2',
    name: 'Sarah Banda',
    email: 'security@nita.gov',
    role: 'cybersecurity_analyst',
  },
  'admin@nita.gov': {
    id: '3',
    name: 'David Phiri',
    email: 'admin@nita.gov',
    role: 'system_admin',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('nita_soc_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, accept any password with the mock emails or create a user with the selected role
    const mockUser = mockUsers[email];
    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem('nita_soc_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    
    // Create a demo user with the selected role
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role,
    };
    setUser(newUser);
    localStorage.setItem('nita_soc_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nita_soc_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
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

export function getRoleName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    network_admin: 'Network Administrator',
    cybersecurity_analyst: 'Cybersecurity Analyst',
    system_admin: 'System Administrator',
  };
  return roleNames[role];
}

export function getRoleColor(role: UserRole): string {
  const roleColors: Record<UserRole, string> = {
    network_admin: 'text-info',
    cybersecurity_analyst: 'text-warning',
    system_admin: 'text-primary',
  };
  return roleColors[role];
}
