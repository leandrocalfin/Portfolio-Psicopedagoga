# Psicopedagoga — Estefani Salaya.

Sitio institucional + panel administrador para la consulta psicopedagógica de **Lic. Salaya Estefani (MPRN 886)**.
Incluye secciones públicas (inicio, servicios, sobre mí, información, preguntas frecuentes, contacto, turnos) y un panel admin para gestionar todo el contenido sin tocar código.

## Stack

- **Frontend:** React + Vite + Tailwind CSS v4, `lucide-react` para iconos, reCAPTCHA v3 en formularios públicos.
- **Backend:** Node.js + Express 4, MongoDB (Mongoose), JWT en cookie httpOnly, Cloudinary para imágenes, Redis opcional (captcha / rate limiting persistente), `helmet` + `express-rate-limit`.
- **Producción:** el backend sirve el build del frontend (`frontend/dist`).

## Estructura

```
Psicopedagoga/
├── frontend/          # React + Vite + Tailwind
│   └── src/
│       ├── Admin.jsx            # Panel administrador (ruta #/admin)
│       ├── App.jsx              # Sitio público + footer + acceso admin
│       ├── AuthContext.jsx      # Sesión (cookie httpOnly)
│       ├── DataContext.jsx      # Contenido público desde la API
│       └── components/          # Hero, Servicios, SobreMi, Informacion,
│                                # FAQ, Contacto, Turnos, AnuncioFlotante...
├── backend/
│   └── src/
│       ├── index.js             # App Express + rate limits + static dist
│       ├── routes/index.js      # Rutas API (login con rate limit propio)
│       ├── controllers/         # auth, contenido, turnos, contacto...
│       ├── middleware/          # auth, validators, upload, adminLogger
│       └── scripts/seed.js      # Datos iniciales
└── package.json       # Scripts raíz (dev, build, seed, install:all)
```

## Requisitos

- Node.js 20+
- MongoDB (Atlas o local)
- Cloudinary (imágenes)
- Claves de reCAPTCHA v3 de Google (contacto y reserva de turnos)
- Redis (opcional; sin Redis el rate limiting es en memoria y se resetea al reiniciar)

## Instalación

```bash
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# completar las variables (ver abajo)
npm run seed   # datos iniciales (usuario admin, secciones, contacto...)
npm run dev    # levanta backend + frontend juntos
```

- Frontend dev: http://localhost:5173 (proxy `/api` → backend)
- Backend dev: http://localhost:4000

## Variables de entorno

Backend (`backend/.env`):

| Variable | Descripción |
|---|---|
| `MONGODB_URI` | Conexión MongoDB |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Firma y duración del token |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Subida de imágenes |
| `REDIS_URL` | Opcional (captcha y límites persistentes) |
| `REGISTER_INVITATION_TOKEN` | Opcional; si se define, el registro exige invitación |
| `RECAPTCHA_SECRET_KEY` / `RECAPTCHA_SITE_KEY` / `RECAPTCHA_MIN_SCORE` | reCAPTCHA v3 |
| `PORT` / `NODE_ENV` / `FRONTEND_URL` | Puerto, entorno y CORS |

Frontend (`frontend/.env`):

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | Por defecto `/api` |
| `VITE_RECAPTCHA_SITE_KEY` | Clave pública reCAPTCHA v3 |

## Scripts

```bash
npm run dev          # backend + frontend en modo desarrollo
npm run dev:backend  # solo backend (node --watch)
npm run dev:frontend # solo frontend (vite)
npm run build        # build de producción del frontend
npm run seed         # carga datos iniciales en MongoDB
```

## Panel administrador

- URL: `#/admin` (ej. `https://tusitio.com/#/admin`).
- Acceso rápido: candadito discreto en el footer, al lado de "Todos los derechos reservados".
- Login con email + contraseña (límite: 20 intentos / 15 min por IP, solo en `POST /auth/login`).
- La sesión expira por inactividad (10 min) y usa cookie httpOnly.
- El cambio de contraseña **no** pide captcha: estás autenticada, se valida la contraseña actual y hay límite de 5 intentos / 15 min por usuario.
- Secciones gestionables: inicio, servicios, sobre mí, información/artículos, preguntas frecuentes, contacto y redes, agenda/turnos, anuncios, perfil y contraseña.

## Seguridad

- `helmet`, CORS restringido a `FRONTEND_URL`, cookies httpOnly.
- Rate limit global (100 req / 15 min) + límite específico en login.
- Validación con `express-validator` en todas las entradas.
- reCAPTCHA v3 en contacto y reserva de turnos; captcha de imagen en cambio de contraseña **eliminado** a propósito (ver arriba).
- Logs de intentos de login, cambios de contraseña y acciones de admin.

## Deploy (Render)

1. Crear servicio web con el repo; comando de build: `npm run install:all && npm run build`.
2. Comando de inicio: `npm run dev:backend` o `node backend/src/index.js` (con `NODE_ENV=production` sirve `frontend/dist` automáticamente).
3. Definir todas las variables de entorno del backend en el dashboard.
4. Correr el seed una vez contra la base de producción (`npm run seed --prefix backend` con el `.env` de prod).
