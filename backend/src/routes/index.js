import { Router } from "express";
import { proteger } from "../middleware/auth.js";
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
  uploadImagen,
  uploadMultiple,
  deleteImagen,
} from "../controllers/uploadController.js";
import { uploadSingle, uploadMultiple as uploadMultipleMiddleware } from "../middleware/upload.js";

const router = Router();

// Auth (públicas)
router.post("/auth/login", login);
router.post("/auth/register", register);

// Auth (protegidas)
router.get("/auth/me", proteger, me);
router.put("/auth/perfil", proteger, updatePerfil);
router.put("/auth/password", proteger, cambiarPassword);
router.post("/auth/logout", logout);

// Captcha (público)
router.get("/captcha", getCaptcha);
router.get("/auth/captcha", getCaptcha);

// Hero
router.get("/hero", getHero);
router.put("/hero", proteger, updateHero);

// Sobre Mí
router.get("/sobre-mi", getSobreMi);
router.put("/sobre-mi", proteger, updateSobreMi);

// Servicios
router.get("/servicios", getServicios);
router.post("/servicios", proteger, createServicio);
router.put("/servicios/:id", proteger, updateServicio);
router.delete("/servicios/:id", proteger, deleteServicio);

// Información / Artículos
router.get("/informacion", getArticulos);
router.post("/informacion", proteger, createArticulo);
router.put("/informacion/:id", proteger, updateArticulo);
router.delete("/informacion/:id", proteger, deleteArticulo);

// FAQs
router.get("/faqs", getFAQs);
router.post("/faqs", proteger, createFAQ);
router.put("/faqs/:id", proteger, updateFAQ);
router.delete("/faqs/:id", proteger, deleteFAQ);

// Datos de contacto
router.get("/datos", getDatosContacto);
router.put("/datos", proteger, updateDatosContacto);

// Horarios de atención
router.get("/horarios", getHorarios);
router.put("/horarios", proteger, updateHorarios);

// Config del sitio (pública lectura, solo admin escribe)
router.get("/config", getConfig);
router.put("/config", proteger, updateConfig);

// Anuncios / carteles flotantes (público leer, solo admin escribir)
router.get("/anuncios", getAnuncios);
router.post("/anuncios", proteger, createAnuncio);
router.put("/anuncios/:id", proteger, updateAnuncio);
router.delete("/anuncios/:id", proteger, deleteAnuncio);

// Agenda / Turnos
router.get("/agenda", getTurnos);
router.post("/agenda/reservar", reservarTurno);
router.post("/agenda", proteger, createTurno);
router.put("/agenda/:id", proteger, updateTurno);
router.delete("/agenda/:id", proteger, deleteTurno);

// Upload imágenes
router.post("/upload", proteger, uploadSingle("imagen"), uploadImagen);
router.post("/upload/multiple", proteger, uploadMultipleMiddleware("imagenes", 5), uploadMultiple);
router.delete("/upload", proteger, deleteImagen);

export default router;