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
  handleValidation,
];

// Generic ID validator
export const validateId = [
  param("id").isMongoId().withMessage("ID inválido"),
  handleValidation,
];

// Hero: el front manda {titulo, descripcion, imagenes[]} (ver SeccionInicio).
export const validateHero = [
  body("titulo").optional().trim().isLength({ max: 200 }).withMessage("Título máx 200 caracteres"),
  body("descripcion").optional().trim().isLength({ max: 5000 }).withMessage("Descripción máx 5000 caracteres"),
  body("imagenes").optional().isArray({ max: 5 }).withMessage("Máximo 5 imágenes"),
  body("imagenes.*").optional().isString(),
  handleValidation,
];

// SobreMi: el front manda {titulo, descripcion, imagen, items[], certificados[], mostrarLibro}.
export const validateSobreMi = [
  body("titulo").optional().trim().isLength({ max: 200 }).withMessage("Título máx 200 caracteres"),
  body("descripcion").optional().trim().isLength({ max: 8000 }).withMessage("Descripción máx 8000 caracteres"),
  body("imagen").optional().isString(),
  body("items").optional().isArray(),
  body("certificados").optional().isArray(),
  body("mostrarLibro").optional().isBoolean(),
  handleValidation,
];

// Servicio validators (el front siempre manda objeto completo).
export const validateServicio = [
  body("titulo").trim().isLength({ min: 2, max: 150 }).withMessage("Título 2-150 caracteres"),
  body("descripcion").trim().isLength({ min: 2, max: 2000 }).withMessage("Descripción 2-2000 caracteres"),
  body("icono").optional().trim().isLength({ max: 50 }),
  body("orden").optional().isInt({ min: 0 }).withMessage("Orden debe ser entero positivo"),
  body("activo").optional().isBoolean(),
  handleValidation,
];

// Articulo: el front manda {titulo, descripcion, imagen, tag, cuerpo[]} (ver SeccionInformacion).
export const validateArticulo = [
  body("titulo").trim().isLength({ min: 2, max: 200 }).withMessage("Título 2-200 caracteres"),
  body("descripcion").trim().isLength({ min: 2, max: 2000 }).withMessage("Descripción 2-2000 caracteres"),
  body("imagen").optional().isString(),
  body("tag").optional().trim().isLength({ max: 100 }),
  body("cuerpo").optional().isArray(),
  body("publicado").optional().isBoolean(),
  body("orden").optional().isInt({ min: 0 }),
  handleValidation,
];

// FAQ validators
export const validateFAQ = [
  body("pregunta").trim().isLength({ min: 5, max: 300 }).withMessage("Pregunta 5-300 caracteres"),
  body("respuesta").trim().isLength({ min: 10, max: 2000 }).withMessage("Respuesta 10-2000 caracteres"),
  body("orden").optional().isInt({ min: 0 }),
  handleValidation,
];

// DatosContacto: el front manda {whatsapp, email, direccion, instagram, horariosTexto, mapsUrl}.
export const validateDatosContacto = [
  body("whatsapp").optional().trim().isLength({ max: 50 }),
  body("email").optional().isEmail().normalizeEmail().withMessage("Email inválido"),
  body("direccion").optional().trim().isLength({ max: 200 }),
  body("instagram").optional().trim().isLength({ max: 300 }),
  body("horariosTexto").optional().trim().isLength({ max: 300 }),
  body("mapsUrl").optional().trim().isLength({ max: 500 }),
  handleValidation,
];

// Horarios: el front manda {dias: [{dia: Lun..Dom, horas: [HH:MM]}]} (ver SeccionAgenda).
export const validateHorarios = [
  body("dias").isArray().withMessage("Días debe ser array"),
  body("dias.*.dia").isIn(["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]).withMessage("Día inválido"),
  body("dias.*.semana").optional().isIn([1, 2]).withMessage("Semana inválida"),
  body("dias.*.horas").optional().isArray(),
  body("dias.*.horas.*").optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Formato HH:MM"),
  handleValidation,
];

// Config: el front manda {turnosHabilitados, mensajeTurnosPausados}.
export const validateConfig = [
  body("turnosHabilitados").optional().isBoolean(),
  body("mensajeTurnosPausados").optional().trim().isLength({ max: 500 }),
  handleValidation,
];

// Anuncio: el front manda {titulo, mensaje, imagen, activo} (ver SeccionAnuncios).
export const validateAnuncio = [
  body("titulo").trim().isLength({ min: 2, max: 200 }).withMessage("Título 2-200 caracteres"),
  body("mensaje").optional().trim().isLength({ max: 1000 }).withMessage("Mensaje máx 1000 caracteres"),
  body("imagen").optional().isString(),
  body("activo").optional().isBoolean(),
  body("orden").optional().isInt({ min: 0 }),
  handleValidation,
];

// Edición parcial de anuncios (ej. toggle {activo}).
export const validateAnuncioUpdate = [
  body("titulo").optional().trim().isLength({ min: 2, max: 200 }).withMessage("Título 2-200 caracteres"),
  body("mensaje").optional().trim().isLength({ max: 1000 }).withMessage("Mensaje máx 1000 caracteres"),
  body("imagen").optional().isString(),
  body("activo").optional().isBoolean(),
  body("orden").optional().isInt({ min: 0 }),
  handleValidation,
];

// Agenda / Turnos (modelo Turno: dia, hora, nombre, apellido, detalle,
// estado, fecha, notas, telefono, servicio, modalidad, origen).
// El validateTurno anterior pedía fecha/horaInicio/horaFin de otro esquema
// y rompía TODA creación y edición desde el admin.
const DIAS_AGENDA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const ESTADOS_TURNO = ["pendiente", "confirmado", "cancelado", "completado"];
const HORA_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const validateAgenda = [
  body("dia").isIn(DIAS_AGENDA).withMessage("Día inválido"),
  body("hora").matches(HORA_RE).withMessage("Hora HH:MM"),
  body("nombre").trim().isLength({ min: 2, max: 100 }).withMessage("Nombre 2-100 caracteres"),
  body("apellido").optional().trim().isLength({ max: 100 }),
  body("detalle").optional().trim().isLength({ max: 500 }),
  body("notas").optional().trim().isLength({ max: 2000 }),
  body("estado").optional().isIn(ESTADOS_TURNO).withMessage("Estado inválido"),
  body("fecha").optional().isISO8601().withMessage("Fecha inválida (ISO8601)"),
  body("telefono").optional().trim().isLength({ max: 50 }),
  body("servicio").optional().trim().isLength({ max: 100 }),
  body("modalidad").optional().trim().isLength({ max: 50 }),
  handleValidation,
];

// Edición parcial (ej. solo { estado }): todo opcional.
export const validateAgendaUpdate = [
  body("dia").optional().isIn(DIAS_AGENDA).withMessage("Día inválido"),
  body("hora").optional().matches(HORA_RE).withMessage("Hora HH:MM"),
  body("nombre").optional().trim().isLength({ min: 2, max: 100 }).withMessage("Nombre 2-100 caracteres"),
  body("apellido").optional().trim().isLength({ max: 100 }),
  body("detalle").optional().trim().isLength({ max: 500 }),
  body("notas").optional().trim().isLength({ max: 2000 }),
  body("estado").optional().isIn(ESTADOS_TURNO).withMessage("Estado inválido"),
  body("fecha").optional().isISO8601().withMessage("Fecha inválida (ISO8601)"),
  body("telefono").optional().trim().isLength({ max: 50 }),
  body("servicio").optional().trim().isLength({ max: 100 }),
  body("modalidad").optional().trim().isLength({ max: 50 }),
  handleValidation,
];

export const validateReservarTurno = [
  // Debe coincidir con lo que envía Turnos.jsx: dia, hora, nombre,
  // telefono, servicio, modalidad, fecha (+ recaptchaToken que valida
  // validateRecaptcha). Antes pedía turnoId y email que el front no manda,
  // por eso TODA reserva fallaba con "Error de validación".
  body("dia").trim().notEmpty().withMessage("Día requerido"),
  body("hora").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Hora HH:MM"),
  body("nombre").trim().isLength({ min: 2, max: 100 }).withMessage("Insertá tu nombre"),
  body("apellido").trim().isLength({ min: 2, max: 100 }).withMessage("Insertá tu apellido"),
  body("telefono")
    .trim()
    .notEmpty()
    .withMessage("Insertá tu teléfono")
    .custom((v) => {
      const digitos = String(v).replace(/\D/g, "");
      if (digitos.length < 8 || digitos.length > 15) throw new Error("Insertá un número válido");
      if (/^(\d)\1+$/.test(digitos)) throw new Error("Insertá un número válido");
      if (/^(0123456789|1234567890|9876543210|0987654321)$/.test(digitos)) throw new Error("Insertá un número válido");
      return true;
    }),
  body("servicio").optional().trim().isLength({ max: 100 }),
  body("modalidad").optional().trim().isLength({ max: 50 }),
  body("detalle").optional().trim().isLength({ max: 500 }),
  body("fecha").optional().isISO8601().withMessage("Fecha inválida (ISO8601)"),
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
  // En dev sin RECAPTCHA_SECRET_KEY el token es opcional (igual que en
  // verifyRecaptcha, que ahí deja pasar). En producción con secret
  // configurado, se exige siempre.
  body("recaptchaToken").custom((v) => {
    if (!v && !process.env.RECAPTCHA_SECRET_KEY) return true;
    if (typeof v !== "string" || !v.trim()) throw new Error("Token reCAPTCHA requerido");
    return true;
  }),
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