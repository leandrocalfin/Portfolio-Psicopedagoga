const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(url, config);
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

  // Hero
  getHero: () => request('/hero'),
  updateHero: (data, token) => request('/hero', { method: 'PUT', body: data, headers: { Authorization: `Bearer ${token}` } }),

  // Sobre Mí
  getSobreMi: () => request('/sobre-mi'),
  updateSobreMi: (data, token) => request('/sobre-mi', { method: 'PUT', body: data, headers: { Authorization: `Bearer ${token}` } }),

  // Servicios
  getServicios: () => request('/servicios'),
  createServicio: (data, token) => request('/servicios', { method: 'POST', body: data, headers: { Authorization: `Bearer ${token}` } }),
  updateServicio: (id, data, token) => request(`/servicios/${id}`, { method: 'PUT', body: data, headers: { Authorization: `Bearer ${token}` } }),
  deleteServicio: (id, token) => request(`/servicios/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }),

  // Información / Artículos
  getArticulos: () => request('/informacion'),
  createArticulo: (data, token) => request('/informacion', { method: 'POST', body: data, headers: { Authorization: `Bearer ${token}` } }),
  updateArticulo: (id, data, token) => request(`/informacion/${id}`, { method: 'PUT', body: data, headers: { Authorization: `Bearer ${token}` } }),
  deleteArticulo: (id, token) => request(`/informacion/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }),

  // FAQs
  getFAQs: () => request('/faqs'),
  createFAQ: (data, token) => request('/faqs', { method: 'POST', body: data, headers: { Authorization: `Bearer ${token}` } }),
  updateFAQ: (id, data, token) => request(`/faqs/${id}`, { method: 'PUT', body: data, headers: { Authorization: `Bearer ${token}` } }),
  deleteFAQ: (id, token) => request(`/faqs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }),

  // Datos de contacto
  getDatos: () => request('/datos'),
  updateDatos: (data, token) => request('/datos', { method: 'PUT', body: data, headers: { Authorization: `Bearer ${token}` } }),

  // Horarios
  getHorarios: () => request('/horarios'),
  updateHorarios: (data, token) => request('/horarios', { method: 'PUT', body: data, headers: { Authorization: `Bearer ${token}` } }),

  // Agenda / Turnos
  getTurnos: () => request('/agenda'),
  createTurno: (data, token) => request('/agenda', { method: 'POST', body: data, headers: { Authorization: `Bearer ${token}` } }),
  updateTurno: (id, data, token) => request(`/agenda/${id}`, { method: 'PUT', body: data, headers: { Authorization: `Bearer ${token}` } }),
  deleteTurno: (id, token) => request(`/agenda/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }),

  // Upload
  uploadImagen: (file, token, folder = 'psicopedagoga') => {
    const formData = new FormData();
    formData.append('imagen', file);
    formData.append('folder', folder);
    return fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).then(r => r.json());
  },
  uploadMultiple: (files, token, folder = 'psicopedagoga') => {
    const formData = new FormData();
    files.forEach(f => formData.append('imagenes', f));
    formData.append('folder', folder);
    return fetch(`${API_BASE}/upload/multiple`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).then(r => r.json());
  },
  deleteImagen: (publicId, token) => request('/upload', { method: 'DELETE', body: { publicId }, headers: { Authorization: `Bearer ${token}` } }),
};

export function getAuthToken() {
  return localStorage.getItem('token');
}

export function setAuthToken(token) {
  localStorage.setItem('token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('token');
}

export function isAuthenticated() {
  return !!getAuthToken();
}