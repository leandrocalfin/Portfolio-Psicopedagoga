import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { getConsent, setConsent } from "../cookies.js";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
    const alCambiar = () => setVisible(false);
    const alAbrir = () => setVisible(true);
    window.addEventListener("cookie-consent", alCambiar);
    window.addEventListener("abrir-cookies", alAbrir);
    return () => {
      window.removeEventListener("cookie-consent", alCambiar);
      window.removeEventListener("abrir-cookies", alAbrir);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-6 md:max-w-md z-[70] bg-white rounded-2xl card-shadow border border-lila-100 p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-lila-900">
        <Cookie size={16} /> Usamos cookies
      </p>
      <p className="mt-1.5 text-[13px] text-stone-600 leading-relaxed">
        Utilizamos cookies propias y de terceros (Google reCAPTCHA, Google Maps) para que el sitio funcione y para
        responder tus consultas. Podés aceptar o rechazar. Más info en nuestra{" "}
        <a href="#/cookies" className="text-lila-700 underline underline-offset-2">Política de Cookies</a>.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setConsent("rechazadas")}
          className="flex-1 text-xs font-semibold px-4 py-2.5 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
        >
          Rechazar
        </button>
        <button
          onClick={() => setConsent("aceptadas")}
          className="flex-1 text-xs font-semibold px-4 py-2.5 rounded-full bg-lila-900 text-white hover:bg-lila-700 transition"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
