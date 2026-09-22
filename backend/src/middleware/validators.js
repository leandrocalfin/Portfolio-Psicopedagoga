import { body, param, query, validationResult } from "express-validator";

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ mensaje: "Error de validación", errores: errors.array().map(e => e.msg) });
  }
  next();
};

// Auth validators
export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Contraseña requerida"),
  handleValidation,
];

export const validateRegister = [
  body("nombre").trim().isLength({ min: 2, max: 100 }).withMessage("Nombre entre 2 y 100 caracteres"),
  body("email").isEmail().normalizeEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 8 }).withMessage("Mínimo 8 caracteres")
    .matches(/[a-z]/).withMessage("Al menos una minúscula")
    .matches(/[A-Z]/).withMessage("Al menos una mayúscula")
    .matches(/\d/).withMessage("Al menos un número")
    .matches(/[^A-Za-z0-9]/).withMessage("Al menos un símbolo"),
  body("invitacionToken").optional().isString(),
  handleValidation,
];

export const validateUpdatePerfil = [
  body("nombre").optional().trim().isLength({ min: 2, max: 100 }).withMessage("Nombre entre 2 y 100 caracteres"),
  body("email").optional().isEmail().normalizeEmail().withMessage("Email inválido"),
  body("avatar").optional().isString(),
  handleValidation,
];

export const validateCambiarPassword = [
  body("actual").notEmpty().withMessage("Contraseña actual requerida"),
  body("nueva")
    .isLength({ min: 8 }).withMessage("Mínimo 8 caracteres")
    .matches(/[a-z]/).withMessage("Al menos una minúscula")
    .matches(/[A-Z]/).withMessage("Al menos una mayúscula")
    .matches(/\d/).withMessage("Al menos un número")
    .matches(/[^A-Za-z0-9]/).withMessage("Al menos un símbolo"),
  body("confirmar").optional().custom((value, { req }) => value === req.body.nueva).withMessage("No coincide"),
  body("captchaId").notEmpty().withMessage("Captcha requerido"),
  body("captcha").notEmpty().withMessage("Captcha requerido"),
  handleValidation,
];

// Generic ID validator
export const validateId = [
  param("id").isMongoId().withMessage("ID inválido"),
  handleValidation,
];

// Hero validators
export const validateHero = [
  body("titulo").optional().trim().isLength({ max: 200 }).withMessage("Título máx 200 caracteres"),
  body("subtitulo").optional().trim().isLength({ max: 500 }).withMessage("Subtítulo máx 500 caracteres"),
  body("imagen").optional().isString(),
  body("ctaTexto").optional().trim().isLength({ max: 50 }).withMessage("CTA máx 50 caracteres"),
  body("ctaEnlace").optional().isURL().withMessage("Enlace inválido"),
  handleValidation,
];

// SobreMi validators
export const validateSobreMi = [
  body("titulo").optional().trim().isLength({ max: 200 }).withMessage("Título máx 200 caracteres"),
  body("contenido").optional().trim().isLength({ max: 5000 }).withMessage("Contenido máx 5000 caracteres"),
  body("imagen").optional().isString(),
  handleValidation,
];

// Servicio validators
export const validateServicio = [
  body("titulo").trim().isLength({ min: 2, max: 150 }).withMessage("Título 2-150 caracteres"),
  body("descripcion").trim().isLength({ min: 10, max: 2000 }).withMessage("Descripción 10-2000 caracteres"),
  body("icono").optional().trim().isLength({ max: 50 }),
  body("orden").optional().isInt({ min: 0 }).withMessage("Orden debe ser entero positivo"),
  handleValidation,
];

// Articulo validators
export const validateArticulo = [
  body("titulo").trim().isLength({ min: 2, max: 200 }).withMessage("Título 2-200 caracteres"),
  body("resumen").trim().isLength({ min: 10, max: 500 }).withMessage("Resumen 10-500 caracteres"),
  body("contenido").trim().isLength({ min: 50 }).withMessage("Contenido mínimo 50 caracteres"),
  body("imagen").optional().isString(),
  body("categoria").optional().trim().isLength({ max: 100 }),
  body("etiquetas").optional().isArray(),
  body("publicado").optional().isBoolean(),
  handleValidation,
];

// FAQ validators
export const validateFAQ = [
  body("pregunta").trim().isLength({ min: 5, max: 300 }).withMessage("Pregunta 5-300 caracteres"),
  body("respuesta").trim().isLength({ min: 10, max: 2000 }).withMessage("Respuesta 10-2000 caracteres"),
  body("orden").optional().isInt({ min: 0 }),
  handleValidation,
];

// DatosContacto validators
export const validateDatosContacto = [
  body("email").optional().isEmail().normalizeEmail().withMessage("Email inválido"),
  body("telefono").optional().trim().isLength({ max: 50 }),
  body("direccion").optional().trim().isLength({ max: 200 }),
  body("mapaUrl").optional().isURL().withMessage("URL de mapa inválida"),
  body("horarios").optional().isArray(),
  handleValidation,
];

// Horarios validators
export const validateHorarios = [
  body("horarios").isArray().withMessage("Horarios debe ser array"),
  body("horarios.*.dia").isIn(["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]).withMessage("Día inválido"),
  body("horarios.*.inicio").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Formato HH:MM"),
  body("horarios.*.fin").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Formato HH:MM"),
  body("horarios.*.activo").optional().isBoolean(),
  handleValidation,
];

// Config validators
export const validateConfig = [
  body("sitioNombre").optional().trim().isLength({ max: 100 }),
  body("sitioDescripcion").optional().trim().isLength({ max: 300 }),
  body("logo").optional().isString(),
  body("favicon").optional().isString(),
  body("redesSociales").optional().isObject(),
  handleValidation,
];

// Anuncio validators
export const validateAnuncio = [
  body("titulo").trim().isLength({ min: 2, max: 200 }).withMessage("Título 2-200 caracteres"),
  body("mensaje").trim().isLength({ min: 10, max: 1000 }).withMessage("Mensaje 10-1000 caracteres"),
  body("tipo").isIn(["info", "warning", "success", "error"]).withMessage("Tipo inválido"),
  body("activo").optional().isBoolean(),
  body("posicion").optional().isIn(["top", "bottom"]).withMessage("Posición inválida"),
  handleValidation,
];

// Turno validators
export const validateTurno = [
  body("fecha").isISO8601().withMessage("Fecha inválida (ISO8601)"),
  body("horaInicio").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Hora inicio HH:MM"),
  body("horaFin").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Hora fin HH:MM"),
  body("disponible").optional().isBoolean(),
  handleValidation,
];

export const validateReservarTurno = [
  body("turnoId").isMongoId().withMessage("ID de turno inválido"),
  body("nombre").trim().isLength({ min: 2, max: 100 }).withMessage("Nombre 2-100 caracteres"),
  body("email").isEmail().normalizeEmail().withMessage("Email inválido"),
  body("telefono").optional().trim().isLength({ max: 50 }),
  body("motivo").optional().trim().isLength({ max: 500 }),
  handleValidation,
];

// Upload validators
export const validateDeleteImagen = [
  body("publicId").isString().notEmpty().withMessage("publicId requerido"),
  handleValidation,
];

export const validateSignedUploadParams = [
  body("folder").optional().isString().isLength({ max: 100 }).withMessage("Folder inválido"),
  body("resourceType").optional().isIn(["image", "video", "raw", "auto"]).withMessage("Tipo de recurso inválido"),
  handleValidation,
];

export const validateRecaptcha = [
  body("recaptchaToken").isString().notEmpty().withMessage("Token reCAPTCHA requerido"),
  handleValidation,
];

// Query validators para paginación/filtrado
export const validateQuery = [
  query("page").optional().isInt({ min: 1 }).withMessage("Página inválida"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Límite 1-100"),
  query("sort").optional().isString(),
  query("search").optional().isString(),
  handleValidation,
];