import { Router } from "express";
import { proteger } from "../middleware/auth.js";
import {
  login,
  register,
  me,
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
  getTurnos,
  createTurno,
  updateTurno,
  deleteTurno,
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

// Agenda / Turnos
router.get("/agenda", getTurnos);
router.post("/agenda", proteger, createTurno);
router.put("/agenda/:id", proteger, updateTurno);
router.delete("/agenda/:id", proteger, deleteTurno);

// Upload imágenes
router.post("/upload", proteger, uploadSingle("imagen"), uploadImagen);
router.post("/upload/multiple", proteger, uploadMultipleMiddleware("imagenes", 5), uploadMultiple);
router.delete("/upload", proteger, deleteImagen);

export default router;