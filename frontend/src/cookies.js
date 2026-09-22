const CLAVE = "cookie-consent";

export function getConsent() {
  try {
    return localStorage.getItem(CLAVE); // "aceptadas" | "rechazadas" | null
  } catch {
    return null;
  }
}

export function setConsent(valor) {
  try {
    localStorage.setItem(CLAVE, valor);
  } catch {}
  window.dispatchEvent(new CustomEvent("cookie-consent", { detail: valor }));
}

export function consentAceptado() {
  return getConsent() === "aceptadas";
}

// Para reabrir el banner desde enlaces ("cambiar mi elección")
export function pedirConsentimiento() {
  window.dispatchEvent(new CustomEvent("abrir-cookies"));
}
