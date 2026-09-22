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
    script.onload = () => {
      recaptchaLoaded = true;
      // Esperar a que grecaptcha esté listo
      const checkReady = setInterval(() => {
        if (window.grecaptcha) {
          clearInterval(checkReady);
          resolve(window.grecaptcha);
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