const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Auth por cookie httpOnly: el navegador envía la cookie solo.
// El 2do parámetro (_token) se mantiene por compatibilidad con llamadas
// existentes pero se ignora: nunca más se usa ni se guarda ningún token en JS.
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };
  config.credentials = 'include';
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.mensaje || `Error ${res.status}`);
  }
  return data;
}

async function uploadFetch(endpoint, formData) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.mensaje || `Error ${res.status}`);
  }
  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (nombre, email, password) => request('/auth/register', { method: 'POST', body: { nombre, email, password } }),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
  updatePerfil: (data) => request('/auth/perfil', { method: 'PUT', body: data }),
  updatePassword: (data) => request('/auth/password', { method: 'PUT', body: data }),

  // Hero
  getHero: () => request('/hero'),
  updateHero: (data) => request('/hero', { method: 'PUT', body: data }),

  // Sobre Mí
  getSobreMi: () => request('/sobre-mi'),
  updateSobreMi: (data) => request('/sobre-mi', { method: 'PUT', body: data }),

  // Servicios
  getServicios: () => request('/servicios'),
  createServicio: (data) => request('/servicios', { method: 'POST', body: data }),
  updateServicio: (id, data) => request(`/servicios/${id}`, { method: 'PUT', body: data }),
  deleteServicio: (id) => request(`/servicios/${id}`, { method: 'DELETE' }),

  // Información / Artículos
  getArticulos: () => request('/informacion'),
  createArticulo: (data) => request('/informacion', { method: 'POST', body: data }),
  updateArticulo: (id, data) => request(`/informacion/${id}`, { method: 'PUT', body: data }),
  deleteArticulo: (id) => request(`/informacion/${id}`, { method: 'DELETE' }),

  // FAQs
  getFAQs: () => request('/faqs'),
  createFAQ: (data) => request('/faqs', { method: 'POST', body: data }),
  updateFAQ: (id, data) => request(`/faqs/${id}`, { method: 'PUT', body: data }),
  deleteFAQ: (id) => request(`/faqs/${id}`, { method: 'DELETE' }),

  // Datos de contacto
  getDatos: () => request('/datos'),
  updateDatos: (data) => request('/datos', { method: 'PUT', body: data }),

  // Horarios
  getHorarios: () => request('/horarios'),
  updateHorarios: (data) => request('/horarios', { method: 'PUT', body: data }),

  // Config del sitio
  getConfig: () => request('/config'),
  updateConfig: (data) => request('/config', { method: 'PUT', body: data }),

  // Anuncios / carteles flotantes
  getAnuncios: () => request('/anuncios'),
  createAnuncio: (data) => request('/anuncios', { method: 'POST', body: data }),
  updateAnuncio: (id, data) => request(`/anuncios/${id}`, { method: 'PUT', body: data }),
  deleteAnuncio: (id) => request(`/anuncios/${id}`, { method: 'DELETE' }),

  // Agenda / Turnos
  getTurnos: () => request('/agenda'),
  reservarTurno: (data) => request('/agenda/reservar', { method: 'POST', body: data }),
  createTurno: (data) => request('/agenda', { method: 'POST', body: data }),
  updateTurno: (id, data) => request(`/agenda/${id}`, { method: 'PUT', body: data }),
  deleteTurno: (id) => request(`/agenda/${id}`, { method: 'DELETE' }),

  // Upload
  uploadImagen: (file, folder = 'psicopedagoga') => {
    const formData = new FormData();
    formData.append('imagen', file);
    formData.append('folder', folder);
    return uploadFetch('/upload', formData);
  },
  uploadMultiple: (files, folder = 'psicopedagoga') => {
    const formData = new FormData();
    files.forEach(f => formData.append('imagenes', f));
    formData.append('folder', folder);
    return uploadFetch('/upload/multiple', formData);
  },
  deleteImagen: (publicId) => request('/upload', { method: 'DELETE', body: { publicId } }),
};

// Compatibilidad: existen para no romper imports, pero ya no guardan nada.
// Se dejan como no-op y se limpia cualquier token legacy que haya quedado.
export function getAuthToken() {
  return null;
}

export function setAuthToken() {}

export function clearAuthToken() {
  try { localStorage.removeItem('token'); } catch {}
}

export function isAuthenticated() {
  return false;
}
