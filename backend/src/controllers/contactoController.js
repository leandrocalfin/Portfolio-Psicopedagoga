import { verifyRecaptcha } from "../utils/recaptcha.js";
import { logAdminAction } from "../utils/securityLogger.js";

export const enviarContacto = async (req, res) => {
  try {
    const { nombre, email, mensaje, recaptchaToken } = req.body;

    // Verificar reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(recaptchaToken, "contacto");
    if (!recaptchaResult.success) {
      return res.status(400).json({ mensaje: "Verificación de seguridad fallida", error: recaptchaResult.error });
    }

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ mensaje: "Nombre, email y mensaje son requeridos" });
    }

    // Validaciones básicas
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ mensaje: "Email inválido" });
    }

    if (mensaje.length < 10 || mensaje.length > 2000) {
      return res.status(400).json({ mensaje: "El mensaje debe tener entre 10 y 2000 caracteres" });
    }

    // Aquí se podría enviar email, guardar en BD, notificar al admin, etc.
    // Por ahora solo logueamos y respondemos éxito
    const ip = req.ip || req.connection.remoteAddress;
    logAdminAction(null, "CREATE", "contacto_form", { nombre, email, ip, recaptchaScore: recaptchaResult.score });

    // En producción: enviar email al admin, guardar en BD, etc.
    // await sendEmailToAdmin({ nombre, email, mensaje });

    res.json({ mensaje: "Mensaje enviado correctamente. Te contactaremos a la brevedad." });
  } catch (error) {
    console.error("Error en formulario de contacto:", error);
    res.status(500).json({ mensaje: "Error al enviar el mensaje" });
  }
};