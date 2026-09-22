import Usuario from "../models/Usuario.js";
import { generarToken, setAuthCookie, clearAuthCookie } from "../middleware/auth.js";
import svgCaptcha from "svg-captcha";
import { getRedis } from "../config/redis.js";
import {
  logLoginAttempt,
  logPasswordChange,
  logRegistration,
  logLogout,
  logFailedAuth,
} from "../utils/securityLogger.js";

const redis = getRedis();
const CAPTCHA_TTL = 5 * 60; // 5 min en segundos
const INVITATION_TOKEN = process.env.REGISTER_INVITATION_TOKEN; // Token secreto para registro

// Fallback en memoria para desarrollo sin Redis
const memoryCaptchaStore = new Map();
const memoryPwdAttempts = new Map();

const captchaSet = async (key, value, ttl) => {
  if (redis) return redis.setex(key, ttl, value);
  memoryCaptchaStore.set(key, { value, expires: Date.now() + ttl * 1000 });
  setTimeout(() => memoryCaptchaStore.delete(key), ttl * 1000);
};

const captchaGet = async (key) => {
  if (redis) return redis.get(key);
  const entry = memoryCaptchaStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    memoryCaptchaStore.delete(key);
    return null;
  }
  return entry.value;
};

const captchaDel = async (key) => {
  if (redis) return redis.del(key);
  memoryCaptchaStore.delete(key);
};

const pwdAttemptsIncr = async (key, ttl) => {
  if (redis) {
    await redis.incr(key);
    await redis.expire(key, ttl);
    return;
  }
  const count = (memoryPwdAttempts.get(key) || 0) + 1;
  memoryPwdAttempts.set(key, count);
  setTimeout(() => memoryPwdAttempts.delete(key), ttl * 1000);
};

const pwdAttemptsGet = async (key) => {
  if (redis) return redis.get(key);
  return memoryPwdAttempts.get(key)?.toString() || null;
};

const pwdAttemptsDel = async (key) => {
  if (redis) return redis.del(key);
  memoryPwdAttempts.delete(key);
};

export const getCaptcha = async (req, res) => {
  try {
    const captcha = svgCaptcha.create({ size: 4, noise: 2, color: true, background: "#f1eaff" });
    const id = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    await captchaSet(`captcha:${id}`, CAPTCHA_TTL, captcha.text.toLowerCase());
    res.json({ id, svg: captcha.data });
  } catch (error) {
    console.error("Error generando captcha:", error);
    res.status(500).json({ mensaje: "Error generando captcha" });
  }
};

export const login = async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get("user-agent");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logFailedAuth(email, ip, userAgent, "missing_credentials");
      return res.status(400).json({ mensaje: "Email y contraseña son requeridos" });
    }

    const usuario = await Usuario.findOne({ email }).select("+password");
    if (!usuario || !usuario.activo) {
      logFailedAuth(email, ip, userAgent, "user_not_found_or_inactive");
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const coincide = await usuario.compararPassword(password);
    if (!coincide) {
      logFailedAuth(email, ip, userAgent, "invalid_password");
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    usuario.ultimoLogin = new Date();
    await usuario.save();

    const token = generarToken(usuario._id);
    setAuthCookie(res, token);

    logLoginAttempt(email, true, ip, userAgent, usuario._id);

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        avatar: usuario.avatar || "",
        rol: usuario.rol,
      },
    });
  } catch (error) {
    logFailedAuth(req.body.email, ip, userAgent, "server_error");
    res.status(500).json({ mensaje: "Error del servidor", error: error.message });
  }
};

export const register = async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  try {
    const { nombre, email, password, invitacionToken } = req.body;

    // Validar token de invitación si está configurado
    if (INVITATION_TOKEN && invitacionToken !== INVITATION_TOKEN) {
      logRegistration(email, false, ip, true);
      return res.status(403).json({ mensaje: "Registro solo por invitación" });
    }

    const existe = await Usuario.findOne({ email });
    if (existe) {
      logRegistration(email, false, ip, !!INVITATION_TOKEN);
      return res.status(400).json({ mensaje: "El email ya está registrado" });
    }

    const usuario = await Usuario.create({ nombre, email, password });
    const token = generarToken(usuario._id);
    setAuthCookie(res, token);

    logRegistration(email, true, ip, !!INVITATION_TOKEN);

    res.status(201).json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        avatar: usuario.avatar || "",
        rol: usuario.rol,
      },
    });
  } catch (error) {
    logRegistration(req.body.email, false, ip, !!INVITATION_TOKEN);
    res.status(500).json({ mensaje: "Error del servidor", error: error.message });
  }
};

export const me = async (req, res) => {
  res.json({
    usuario: {
      id: req.usuario._id,
      nombre: req.usuario.nombre,
      email: req.usuario.email,
      avatar: req.usuario.avatar || "",
      rol: req.usuario.rol,
    },
  });
};

export const updatePerfil = async (req, res) => {
  try {
    const { nombre, email, avatar } = req.body;
    const usuario = await Usuario.findById(req.usuario._id);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    if (nombre) usuario.nombre = nombre.trim();
    if (email) usuario.email = email.trim().toLowerCase();
    if (avatar !== undefined) usuario.avatar = avatar;
    await usuario.save();
    res.json({
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        avatar: usuario.avatar || "",
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar perfil", error: error.message });
  }
};

export const cambiarPassword = async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userId = req.usuario._id.toString();
  const email = req.usuario.email;
  try {
    const { actual, nueva, confirmar, captchaId, captcha } = req.body;

    const key = `pwd_attempts:${userId}`;
    const attempts = await pwdAttemptsGet(key);
    const count = attempts ? parseInt(attempts, 10) : 0;
    if (count >= 5) {
      logPasswordChange(userId, email, false, ip);
      return res.status(429).json({ mensaje: "Demasiados intentos. Esperá 15 minutos." });
    }

    if (!actual || !nueva) {
      await pwdAttemptsIncr(key, 15 * 60);
      return res.status(400).json({ mensaje: "Contraseña actual y nueva son requeridas" });
    }
    if (nueva.length < 8) return res.status(400).json({ mensaje: "La nueva contraseña debe tener al menos 8 caracteres" });
    if (!/(?=.*[a-z])/.test(nueva)) return res.status(400).json({ mensaje: "La contraseña debe tener al menos una minúscula" });
    if (!/(?=.*[A-Z])/.test(nueva)) return res.status(400).json({ mensaje: "La contraseña debe tener al menos una mayúscula" });
    if (!/(?=.*\d)/.test(nueva)) return res.status(400).json({ mensaje: "La contraseña debe tener al menos un número" });
    if (!/(?=.*[^A-Za-z0-9])/.test(nueva)) return res.status(400).json({ mensaje: "La contraseña debe tener al menos un símbolo" });
    if (confirmar && nueva !== confirmar) return res.status(400).json({ mensaje: "La confirmación no coincide" });
    if (!captchaId || !captcha) {
      await pwdAttemptsIncr(key, 15 * 60);
      return res.status(400).json({ mensaje: "Captcha requerido" });
    }

    const stored = await captchaGet(`captcha:${captchaId}`);
    if (!stored) {
      await pwdAttemptsIncr(key, 15 * 60);
      return res.status(400).json({ mensaje: "Captcha expirado, generá uno nuevo" });
    }
    if (stored !== captcha.toLowerCase()) {
      await pwdAttemptsIncr(key, 15 * 60);
      return res.status(400).json({ mensaje: "Captcha incorrecto" });
    }

    await captchaDel(`captcha:${captchaId}`);

    const usuario = await Usuario.findById(req.usuario._id).select("+password");
    const coincide = await usuario.compararPassword(actual);
    if (!coincide) {
      await pwdAttemptsIncr(key, 15 * 60);
      logPasswordChange(userId, email, false, ip);
      return res.status(401).json({ mensaje: "Contraseña actual incorrecta" });
    }

    usuario.password = nueva;
    await usuario.save();
    await pwdAttemptsDel(key);

    logPasswordChange(userId, email, true, ip);
    res.json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    logPasswordChange(userId, email, false, ip);
    res.status(400).json({ mensaje: "Error al cambiar contraseña", error: error.message });
  }
};

export const logout = async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userId = req.usuario?._id;
  const email = req.usuario?.email;
  clearAuthCookie(res);
  if (userId && email) {
    logLogout(userId, email, ip);
  }
  res.json({ mensaje: "Sesión cerrada" });
};