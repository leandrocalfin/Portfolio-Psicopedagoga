import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

// Opciones de cookie: Lax en local, None+Secure en producción (frontend y backend en distintos orígenes)
const esProduccion = process.env.NODE_ENV === "production";

export const cookieOptions = () => ({
  httpOnly: true,
  secure: esProduccion,
  sameSite: esProduccion ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7d, igual que JWT_EXPIRES_IN por defecto
  path: "/",
});

export const setAuthCookie = (res, token) => {
  res.cookie("token", token, cookieOptions());
};

export const clearAuthCookie = (res) => {
  res.clearCookie("token", { ...cookieOptions(), maxAge: undefined });
};

export const proteger = async (req, res, next) => {
  let token;

  // 1) Cookie httpOnly (nuevo flujo)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2) Header Bearer (compatibilidad con sesiones anteriores en localStorage)
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ mensaje: "No autorizado, token faltante" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = await Usuario.findById(decoded.id).select("-password");
    if (!req.usuario || !req.usuario.activo) {
      return res.status(401).json({ mensaje: "Usuario no encontrado o inactivo" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

export const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};