import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const login = useCallback(async (email, password) => {
    // Limpia cualquier token legacy de sesiones anteriores
    try { localStorage.removeItem('token'); } catch {}
    const data = await api.login(email, password);
    localStorage.setItem("ultima-actividad", String(Date.now()));
    setUsuario(data.usuario);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // Igual se cierra la sesión local aunque falle la red
    }
    localStorage.removeItem("ultima-actividad");
    try { localStorage.removeItem('token'); } catch {}
    setUsuario(null);
  }, []);

  const verificarSesion = useCallback(async () => {
    try { localStorage.removeItem('token'); } catch {}
    // Sin token: la cookie httpOnly viaja sola con credentials:include
    const ultima = Number(localStorage.getItem("ultima-actividad") || 0);
    if (ultima && Date.now() - ultima > 10 * 60 * 1000) {
      try { await api.logout(); } catch {}
      setUsuario(null);
      setCargando(false);
      return;
    }
    try {
      const data = await api.me();
      setUsuario(data.usuario);
      localStorage.setItem("ultima-actividad", String(Date.now()));
    } catch {
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    verificarSesion();
  }, [verificarSesion]);

  // Cierre por inactividad: 10 min sin mouse/teclado/scroll/touch => logout
  useEffect(() => {
    if (!usuario) return;
    let timer;
    const INACTIVIDAD_MS = 10 * 60 * 1000;
    const reset = () => {
      localStorage.setItem("ultima-actividad", String(Date.now()));
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
      }, INACTIVIDAD_MS);
    };
    const eventos = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"];
    eventos.forEach((e) => window.addEventListener(e, reset));
    reset();
    return () => {
      clearTimeout(timer);
      eventos.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [usuario, logout]);

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
