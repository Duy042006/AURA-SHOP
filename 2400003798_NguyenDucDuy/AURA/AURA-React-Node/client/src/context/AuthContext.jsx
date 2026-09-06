import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('aura_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api('/auth/me')
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('aura_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const data = await api('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    localStorage.setItem('aura_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    return api('/auth/register', { method: 'POST', body: payload });
  };

  const logout = () => {
    localStorage.removeItem('aura_token');
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const u = await api('/auth/profile', { method: 'PUT', body: payload });
    setUser(u);
    return u;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
