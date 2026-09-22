import { useDatos } from "../DataContext.jsx";
import { Mail, MapPin, Check, Shield, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api.js";
import { executeRecaptcha } from "../recaptcha.js";
import { getConsent, pedirConsentimiento } from "../cookies.js";

function WhatsAppIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
  );
}
function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
  );
}

export function ContactoFromAPI() {
  const { datos } = useDatos();
  const contacto = datos.datosContacto;
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [bloqueoCookies, setBloqueoCookies] = useState(false);

  useEffect(() => {
    const actualizar = () => setBloqueoCookies(false);
    window.addEventListener("cookie-consent", actualizar);
    return () => window.removeEventListener("cookie-consent", actualizar);
  }, []);

  if (!contacto) return <section id="contacto" className="bg-lila-50/60 py-16 md:py-24 scroll-mt-20 min-h-[calc(100svh-5rem)] flex items-center"><div className="max-w-5xl mx-auto px-5 w-full text-center text-stone-500">Cargando...</div></section>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (getConsent() !== "aceptadas") {
      setBloqueoCookies(true);
      setError("Para enviar el formulario necesitás aceptar las cookies (usamos verificación antispam de Google).");
      return;
    }
    setBloqueoCookies(false);
    setSubmitting(true);
    setError("");
    try {
      const recaptchaToken = await executeRecaptcha("contacto");
      await api.enviarContacto({ ...form, recaptchaToken });
      setSent(true);
      setForm({ nombre: "", email: "", mensaje: "" });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="bg-lila-50/60 py-16 md:py-24 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-5 w-full">
        <p className="text-xs tracking-[0.2em] uppercase text-lila-500 font-semibold text-center">Contacto</p>
        <h2 className="font-serif-display text-3xl md:text-[42px] leading-tight text-lila-900 text-center mt-2">¿Damos el primer paso?</h2>
        <div className="grid lg:grid-cols-2 gap-8 items-stretch mt-4 md:mt-8">
          <div className="flex flex-col justify-center">
            <p className="mt-0 md:mt-4 text-stone-600 text-[15px] leading-relaxed text-justify">Dejame tu consulta o escribí directo a WhatsApp. Estoy para orientarte, despejar tus inquietudes y coordinar una primera escucha. Responderé a la brevedad.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={`https://wa.me/${contacto.whatsapp}`} target="_blank" rel="noreferrer" className="flex-1 min-w-[104px] inline-flex items-center justify-center gap-1.5 text-white font-medium px-3 py-2.5 text-[11px] md:text-[13px] rounded-full transition whitespace-nowrap hover:brightness-95" style={{ backgroundColor: "#25D366" }}><WhatsAppIcon size={15} /> WhatsApp</a>
              <a href={`mailto:${contacto.email}`} aria-label={contacto.email} title={contacto.email} className="flex-1 min-w-[104px] inline-flex items-center justify-center gap-1.5 text-white font-medium px-3 py-2.5 text-[11px] md:text-[13px] rounded-full transition whitespace-nowrap hover:brightness-95" style={{ backgroundColor: "#EA4335" }}><Mail size={15} /> Email</a>
              <a href={contacto.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" className="flex-1 min-w-[104px] inline-flex items-center justify-center gap-1.5 text-white font-medium px-3 py-2.5 text-[11px] md:text-[13px] rounded-full transition whitespace-nowrap hover:brightness-95" style={{ background: "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)" }}><InstagramIcon size={15} /> Instagram</a>
            </div>
            <a href={contacto.mapsUrl} target="_blank" rel="noreferrer" className="mt-4 flex items-start gap-2 text-sm text-stone-600 hover:text-lila-900 transition"><MapPin size={16} className="mt-0.5 shrink-0 text-lila-700" /> <span>Atención presencial en <strong>CRyBE</strong> — {contacto.direccion}</span></a>
            <div className="mt-3 overflow-hidden rounded-2xl border border-lila-100 shadow-sm"><iframe title="Mapa CRyBE" src={`https://www.google.com/maps?q=${encodeURIComponent(contacto.direccion)}&output=embed`} className="w-full h-40" loading="lazy" /></div>
          </div>
          <div className="bg-white rounded-[24px] p-7 card-shadow">
            {sent ? (
              <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center gap-3"><span className="w-12 h-12 rounded-full bg-emerald-100 grid place-items-center"><Check size={22} className="text-emerald-700" /></span><p className="font-serif-display text-2xl text-lila-900">¡Mensaje enviado!</p><p className="text-sm text-stone-600">Te contactaremos muy pronto.</p><button onClick={() => setSent(false)} className="text-sm text-lila-700 underline mt-2">Volver</button></div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="text-[11px] tracking-[0.2em] uppercase text-lila-500 font-semibold block mb-1">Nombre</label><input type="text" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} required className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-lila-500 focus:ring-2 focus:ring-lila-100 bg-white" /></div>
                <div><label className="text-[11px] tracking-[0.2em] uppercase text-lila-500 font-semibold block mb-1">Email</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-lila-500 focus:ring-2 focus:ring-lila-100 bg-white" /></div>
                <div><label className="text-[11px] tracking-[0.2em] uppercase text-lila-500 font-semibold block mb-1">Mensaje</label><textarea rows={4} value={form.mensaje} onChange={(e) => setForm({...form, mensaje: e.target.value})} required className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-lila-500 focus:ring-2 focus:ring-lila-100 bg-white resize-none" /></div>
                {error && <p className="text-xs font-semibold text-red-600 text-center">{error}</p>}
                {bloqueoCookies && <button type="button" onClick={pedirConsentimiento} className="w-full text-xs font-semibold text-lila-700 underline underline-offset-2">Aceptar cookies</button>}
                <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 bg-lila-900 text-white text-xs font-semibold tracking-[0.15em] px-6 py-3 rounded-full hover:bg-lila-700 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  {submitting ? "Enviando..." : <>Enviar mensaje <Send size={14} /></>}
                </button>
                <p className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1">
                  <Shield size={12} className="text-emerald-500" /> Protegido por reCAPTCHA v3
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}