import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from './api';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [datos, setDatos] = useState({
    hero: null,
    sobreMi: null,
    servicios: [],
    articulos: [],
    faqs: [],
    datosContacto: null,
    horarios: null,
    turnos: {},
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarTodo = useCallback(async () => {
    try {
      setCargando(true);
      const [hero, sobreMi, servicios, articulos, faqs, datosContacto, horarios, turnos] = await Promise.all([
        api.getHero().catch(() => null),
        api.getSobreMi().catch(() => null),
        api.getServicios().catch(() => []),
        api.getArticulos().catch(() => []),
        api.getFAQs().catch(() => []),
        api.getDatos().catch(() => null),
        api.getHorarios().catch(() => null),
        api.getTurnos().catch(() => ({})),
      ]);
      setDatos({ hero, sobreMi, servicios, articulos, faqs, datosContacto, horarios, turnos });
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const recargar = useCallback((seccion) => {
    const metodos = {
      hero: api.getHero,
      sobreMi: api.getSobreMi,
      servicios: api.getServicios,
      articulos: api.getArticulos,
      faqs: api.getFAQs,
      datosContacto: api.getDatos,
      horarios: api.getHorarios,
      turnos: api.getTurnos,
    };
    if (metodos[seccion]) {
      metodos[seccion]().then(data => setDatos(d => ({ ...d, [seccion]: data })));
    }
  }, []);

  return (
    <DataContext.Provider value={{ datos, cargando, error, recargar, setDatos }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDatos() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDatos debe usarse dentro de DataProvider');
  return ctx;
}