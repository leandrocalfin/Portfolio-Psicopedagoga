import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getAuthToken, setAuthToken, clearAuthToken } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    setAuthToken(data.token);
    setUsuario(data.usuario);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setUsuario(null);
  }, []);

  const verificarSesion = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setCargando(false);
      return;
    }
    try {
      const data = await api.me();
      setUsuario(data.usuario);
    } catch {
      clearAuthToken();
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    verificarSesion();
  }, [verificarSesion]);

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando, verificarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}