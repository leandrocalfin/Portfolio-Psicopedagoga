import Usuario from "../models/Usuario.js";
import { generarToken, setAuthCookie, clearAuthCookie } from "../middleware/auth.js";
import svgCaptcha from "svg-captcha";

const captchaStore = new Map();
const intentosPassword = new Map();

export const getCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({ size: 4, noise: 2, color: true, background: "#f1eaff" });
  const id = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  captchaStore.set(id, { text: captcha.text, expires: Date.now() + 5 * 60 * 1000 });
  setTimeout(() => captchaStore.delete(id), 5 * 60 * 1000);
  res.json({ id, svg: captcha.data });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: "Email y contraseña son requeridos" });
    }

    const usuario = await Usuario.findOne({ email }).select("+password");
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const coincide = await usuario.compararPassword(password);
    if (!coincide) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    usuario.ultimoLogin = new Date();
    await usuario.save();

    const token = generarToken(usuario._id);
    setAuthCookie(res, token);

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
    res.status(500).json({ mensaje: "Error del servidor", error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ mensaje: "El email ya está registrado" });
    }

    const usuario = await Usuario.create({ nombre, email, password });
    const token = generarToken(usuario._id);
    setAuthCookie(res, token);

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
  try {
    const { actual, nueva, confirmar, captchaId, captcha } = req.body;
    const key = req.usuario._id.toString();
    const now = Date.now();
    let entry = intentosPassword.get(key);
    if (!entry || now > entry.reset) entry = { count: 0, reset: now + 15 * 60 * 1000 };
    if (entry.count >= 5) return res.status(429).json({ mensaje: "Demasiados intentos. Esperá 15 minutos." });
    if (!actual || !nueva) return res.status(400).json({ mensaje: "Contraseña actual y nueva son requeridas" });
    if (nueva.length < 8) return res.status(400).json({ mensaje: "La nueva contraseña debe tener al menos 8 caracteres" });
    if (!/(?=.*[a-z])/.test(nueva)) return res.status(400).json({ mensaje: "La contraseña debe tener al menos una minúscula" });
    if (!/(?=.*[A-Z])/.test(nueva)) return res.status(400).json({ mensaje: "La contraseña debe tener al menos una mayúscula" });
    if (!/(?=.*\d)/.test(nueva)) return res.status(400).json({ mensaje: "La contraseña debe tener al menos un número" });
    if (!/(?=.*[^A-Za-z0-9])/.test(nueva)) return res.status(400).json({ mensaje: "La contraseña debe tener al menos un símbolo" });
    if (confirmar && nueva !== confirmar) return res.status(400).json({ mensaje: "La confirmación no coincide" });
    if (!captchaId || !captcha) {
      entry.count += 1;
      intentosPassword.set(key, entry);
      return res.status(400).json({ mensaje: "Captcha requerido" });
    }
    const stored = captchaStore.get(captchaId);
    if (!stored || Date.now() > stored.expires) {
      captchaStore.delete(captchaId);
      entry.count += 1;
      intentosPassword.set(key, entry);
      return res.status(400).json({ mensaje: "Captcha expirado, generá uno nuevo" });
    }
    if (stored.text.toLowerCase() !== captcha.toLowerCase()) {
      entry.count += 1;
      intentosPassword.set(key, entry);
      return res.status(400).json({ mensaje: "Captcha incorrecto" });
    }
    captchaStore.delete(captchaId);
    const usuario = await Usuario.findById(req.usuario._id).select("+password");
    const coincide = await usuario.compararPassword(actual);
    if (!coincide) {
      entry.count += 1;
      intentosPassword.set(key, entry);
      return res.status(401).json({ mensaje: "Contraseña actual incorrecta" });
    }
    usuario.password = nueva;
    await usuario.save();
    intentosPassword.delete(key);
    res.json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar contraseña", error: error.message });
  }
};

export const logout = async (_req, res) => {
  clearAuthCookie(res);
  res.json({ mensaje: "Sesión cerrada" });
};