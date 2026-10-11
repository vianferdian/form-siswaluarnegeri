import React, { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'smkn1cirebon_auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    // Default logged in as Administrator SMKN 1 Cirebon
    return {
      id: 'usr-smkn1',
      name: 'Admin SMKN 1 Cirebon',
      email: 'admin@smkn1cirebon.sch.id',
      role: 'Admin'
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email, password, role = 'Admin') => {
    const newUser = {
      id: Date.now().toString(),
      name: role === 'Admin' ? 'Admin SMKN 1 Cirebon' : 'Operator SMKN 1 Cirebon',
      email: email || (role === 'Admin' ? 'admin@smkn1cirebon.sch.id' : 'operator@smkn1cirebon.sch.id'),
      role: role
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole) => {
    if (user) {
      setUser({
        ...user,
        role: newRole,
        name: newRole === 'Admin' ? 'Admin SMKN 1 Cirebon' : 'Operator SMKN 1 Cirebon'
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, isAuthenticated: !!user, role: user?.role }}>
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
