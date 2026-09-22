const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const MIN_SCORE = parseFloat(process.env.RECAPTCHA_MIN_SCORE) || 0.5;

export const verifyRecaptcha = async (token, action) => {
  if (!RECAPTCHA_SECRET) {
    console.warn("reCAPTCHA no configurado (RECAPTCHA_SECRET_KEY faltante)");
    return { success: true, score: 1 }; // Permitir en dev si no está configurado
  }

  if (!token) {
    return { success: false, error: "Token reCAPTCHA requerido" };
  }

  try {
    const params = new URLSearchParams({
      secret: RECAPTCHA_SECRET,
      response: token,
    });

    const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: "POST",
      body: params,
    });

    const data = await res.json();

    if (!data.success) {
      return { success: false, error: data["error-codes"]?.join(", ") || "Verificación fallida" };
    }

    if (data.action !== action) {
      return { success: false, error: "Acción reCAPTCHA no coincide" };
    }

    if (data.score < MIN_SCORE) {
      return { success: false, error: `Score bajo: ${data.score} (mín: ${MIN_SCORE})`, score: data.score };
    }

    return { success: true, score: data.score };
  } catch (error) {
    console.error("Error verificando reCAPTCHA:", error);
    return { success: false, error: "Error de verificación" };
  }
};

export const getRecaptchaSiteKey = () => process.env.RECAPTCHA_SITE_KEY || "";