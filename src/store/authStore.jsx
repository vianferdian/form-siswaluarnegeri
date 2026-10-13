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
    // Default null: Admin harus login terlebih dahulu
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      // Coba autentikasi ke backend MySQL via PHP
      const res = await fetch('/api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.user) {
          setUser(data.user);
          return { success: true, user: data.user };
        }
      } else {
        const errData = await res.json().catch(() => null);
        if (errData && errData.error) {
          throw new Error(errData.error);
        }
      }
    } catch (apiErr) {
      // Jika backend PHP belum di-setup / error koneksi database, fallback ke kredensial default
      if (apiErr.message && !apiErr.message.includes('fetch')) {
        throw apiErr;
      }
    }

    // Fallback offline login untuk admin
    if (email === 'admin@smkn1cirebon.sch.id' && password === 'password123') {
      const fallbackUser = {
        id: 'usr-admin-1',
        name: 'Admin SMKN 1 Cirebon',
        email: email,
        role: 'Admin'
      };
      setUser(fallbackUser);
      return { success: true, user: fallbackUser };
    }

    if (email === 'operator@smkn1cirebon.sch.id' && password === 'password123') {
      const fallbackUser = {
        id: 'usr-op-1',
        name: 'Petugas Hubin SMKN 1',
        email: email,
        role: 'Operator'
      };
      setUser(fallbackUser);
      return { success: true, user: fallbackUser };
    }

    throw new Error('Email atau Password salah! Periksa kembali.');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchRole = (newRole) => {
    if (user) {
      setUser({
        ...user,
        role: newRole,
        name: newRole === 'Admin' ? 'Admin SMKN 1 Cirebon' : 'Petugas Hubin SMKN 1'
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
