const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

let recaptchaLoaded = false;
let loadPromise = null;

export const loadRecaptcha = () => {
  if (recaptchaLoaded && window.grecaptcha) {
    return Promise.resolve(window.grecaptcha);
  }

  if (loadPromise) {
    return loadPromise;
  }

  if (!RECAPTCHA_SITE_KEY) {
    console.warn("reCAPTCHA site key no configurada (VITE_RECAPTCHA_SITE_KEY)");
    return Promise.resolve(null);
  }

  loadPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    let intentos = 0;
    script.onload = () => {
      recaptchaLoaded = true;
      // Esperar a que grecaptcha esté COMPLETO (api.js lo define por partes:
      // el objeto aparece antes que .execute y resolver antes rompe con
      // "t.execute is not a function").
      const checkReady = setInterval(() => {
        intentos += 1;
        if (window.grecaptcha && typeof window.grecaptcha.execute === "function") {
          clearInterval(checkReady);
          resolve(window.grecaptcha);
        } else if (intentos > 100) {
          clearInterval(checkReady);
          console.error("reCAPTCHA no terminó de inicializarse");
          resolve(null);
        }
      }, 100);
    };
    script.onerror = () => {
      console.error("Error cargando reCAPTCHA");
      resolve(null);
    };
    document.head.appendChild(script);
  });

  return loadPromise;
};

export const executeRecaptcha = async (action) => {
  const grecaptcha = await loadRecaptcha();
  if (!grecaptcha) {
    return null; // Permitir en dev si no está configurado
  }

  try {
    const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
    return token;
  } catch (error) {
    console.error("Error ejecutando reCAPTCHA:", error);
    return null;
  }
};

export const getRecaptchaSiteKey = () => RECAPTCHA_SITE_KEY || "";