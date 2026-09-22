import { Router } from "express";
import rateLimit from "express-rate-limit";
import { proteger } from "../middleware/auth.js";
import { logAdminActionMiddleware } from "../middleware/adminLogger.js";
import {
  validateLogin,
  validateRegister,
  validateUpdatePerfil,
  validateCambiarPassword,
  validateId,
  validateHero,
  validateSobreMi,
  validateServicio,
  validateArticulo,
  validateFAQ,
  validateDatosContacto,
  validateHorarios,
  validateConfig,
  validateAnuncio,
  validateAnuncioUpdate,
  validateReservarTurno,
  validateDeleteImagen,
  validateSignedUploadParams,
  validateRecaptcha,
  validateQuery,
  validateAgenda,
  validateAgendaUpdate,
} from "../middleware/validators.js";
import {
  login,
  register,
  me,
  logout,
  updatePerfil,
  cambiarPassword,
  getCaptcha,
} from "../controllers/authController.js";
import {
  getHero,
  updateHero,
} from "../controllers/heroController.js";
import {
  getSobreMi,
  updateSobreMi,
} from "../controllers/sobreMiController.js";
import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
} from "../controllers/servicioController.js";
import {
  getArticulos,
  createArticulo,
  updateArticulo,
  deleteArticulo,
} from "../controllers/articuloController.js";
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from "../controllers/faqController.js";
import {
  getDatosContacto,
  updateDatosContacto,
} from "../controllers/datosContactoController.js";
import {
  getHorarios,
  updateHorarios,
} from "../controllers/horariosController.js";
import {
  getConfig,
  updateConfig,
} from "../controllers/configController.js";
import {
  getAnuncios,
  createAnuncio,
  updateAnuncio,
  deleteAnuncio,
} from "../controllers/anuncioController.js";
import {
  getTurnos,
  createTurno,
  updateTurno,
  deleteTurno,
  reservarTurno,
} from "../controllers/turnoController.js";
import {
  enviarContacto,
} from "../controllers/contactoController.js";
import {
  uploadImagen,
  uploadMultiple,
  deleteImagen,
  getSignedUploadParams,
} from "../controllers/uploadController.js";
import { uploadSingle, uploadMultiple as uploadMultipleMiddleware } from "../middleware/upload.js";

const router = Router();
const adminLog = logAdminActionMiddleware;

// Solo el login lleva rate limit estricto (20 intentos fallidos / 15 min por IP).
// Los logins exitosos no cuentan; GET /me, logout, etc. tampoco.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  message: { mensaje: "Demasiados intentos de autenticación, intente en 15 minutos" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth (públicas)
router.post("/auth/login", loginLimiter, validateLogin, login);
router.post("/auth/register", validateRegister, register);

// Auth (protegidas)
router.get("/auth/me", proteger, me);
router.put("/auth/perfil", proteger, adminLog("UPDATE", "perfil"), validateUpdatePerfil, updatePerfil);
router.put("/auth/password", proteger, adminLog("UPDATE", "password"), validateCambiarPassword, cambiarPassword);
router.post("/auth/logout", logout);

// Captcha (público)
router.get("/captcha", getCaptcha);
router.get("/auth/captcha", getCaptcha);

// Hero
router.get("/hero", getHero);
router.put("/hero", proteger, adminLog("UPDATE", "hero"), validateHero, updateHero);

// Sobre Mí
router.get("/sobre-mi", getSobreMi);
router.put("/sobre-mi", proteger, adminLog("UPDATE", "sobre_mi"), validateSobreMi, updateSobreMi);

// Servicios
router.get("/servicios", validateQuery, getServicios);
router.post("/servicios", proteger, adminLog("CREATE", "servicio"), validateServicio, createServicio);
router.put("/servicios/:id", proteger, adminLog("UPDATE", "servicio"), validateId, validateServicio, updateServicio);
router.delete("/servicios/:id", proteger, adminLog("DELETE", "servicio"), validateId, deleteServicio);

// Información / Artículos
router.get("/informacion", validateQuery, getArticulos);
router.post("/informacion", proteger, adminLog("CREATE", "articulo"), validateArticulo, createArticulo);
router.put("/informacion/:id", proteger, adminLog("UPDATE", "articulo"), validateId, validateArticulo, updateArticulo);
router.delete("/informacion/:id", proteger, adminLog("DELETE", "articulo"), validateId, deleteArticulo);

// FAQs
router.get("/faqs", validateQuery, getFAQs);
router.post("/faqs", proteger, adminLog("CREATE", "faq"), validateFAQ, createFAQ);
router.put("/faqs/:id", proteger, adminLog("UPDATE", "faq"), validateId, validateFAQ, updateFAQ);
router.delete("/faqs/:id", proteger, adminLog("DELETE", "faq"), validateId, deleteFAQ);

// Datos de contacto
router.get("/datos", getDatosContacto);
router.put("/datos", proteger, adminLog("UPDATE", "datos_contacto"), validateDatosContacto, updateDatosContacto);

// Contacto form (público con reCAPTCHA)
router.post("/contacto", validateRecaptcha, enviarContacto);

// Horarios de atención
router.get("/horarios", getHorarios);
router.put("/horarios", proteger, adminLog("UPDATE", "horarios"), validateHorarios, updateHorarios);

// Config del sitio (pública lectura, solo admin escribe)
router.get("/config", getConfig);
router.put("/config", proteger, adminLog("UPDATE", "config"), validateConfig, updateConfig);

// Anuncios / carteles flotantes (público leer, solo admin escribir)
router.get("/anuncios", validateQuery, getAnuncios);
router.post("/anuncios", proteger, adminLog("CREATE", "anuncio"), validateAnuncio, createAnuncio);
router.put("/anuncios/:id", proteger, adminLog("UPDATE", "anuncio"), validateId, validateAnuncioUpdate, updateAnuncio);
router.delete("/anuncios/:id", proteger, adminLog("DELETE", "anuncio"), validateId, deleteAnuncio);

// Agenda / Turnos
router.get("/agenda", validateQuery, getTurnos);
router.post("/agenda/reservar", validateReservarTurno, validateRecaptcha, reservarTurno);
router.post("/agenda", proteger, adminLog("CREATE", "turno"), validateAgenda, createTurno);
router.put("/agenda/:id", proteger, adminLog("UPDATE", "turno"), validateId, validateAgendaUpdate, updateTurno);
router.delete("/agenda/:id", proteger, adminLog("DELETE", "turno"), validateId, deleteTurno);

// Upload imágenes (firmadas - cliente sube directo a Cloudinary)
router.post("/upload/signed-params", proteger, adminLog("GET_SIGNED_PARAMS", "upload"), validateSignedUploadParams, getSignedUploadParams);

// Upload imágenes (server-side - legado/compatibilidad)
router.post("/upload", proteger, adminLog("UPLOAD", "imagen"), uploadSingle("imagen"), uploadImagen);
router.post("/upload/multiple", proteger, adminLog("UPLOAD", "imagenes"), uploadMultipleMiddleware("imagenes", 5), uploadMultiple);
router.delete("/upload", proteger, adminLog("DELETE", "imagen"), validateDeleteImagen, deleteImagen);

export default router;