import { useDatos } from "../DataContext.jsx";
import { MessageCircleHeart, Mail, MapPin, Check } from "lucide-react";
import { useState } from "react";

export function ContactoFromAPI() {
  const { datos } = useDatos();
  const contacto = datos.datosContacto;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });

  if (!contacto) return <section id="contacto" className="pink-lavender-bg py-16 scroll-mt-20 min-h-[calc(100svh-5rem)] flex items-center"><div className="max-w-5xl mx-auto px-5 w-full text-center text-stone-500">Cargando...</div></section>;

  return (
    <section id="contacto" className="pink-lavender-bg py-16 scroll-mt-20 min-h-[calc(100svh-5rem)] flex items-center">
      <div className="max-w-5xl mx-auto px-5 w-full">
        <p className="text-xs tracking-[0.2em] uppercase text-lila-500 font-semibold text-center">Contacto</p>
        <h2 className="font-serif-display text-3xl md:text-[42px] leading-tight text-lila-900 text-center mt-2">¿Damos el primer paso?</h2>
        <div className="grid md:grid-cols-2 gap-8 items-stretch mt-4 md:mt-8">
          <div className="flex flex-col justify-center">
            <p className="mt-0 md:mt-4 text-stone-600 text-[15px] leading-relaxed text-justify">Dejame tu consulta o escribí directo a WhatsApp. Estoy para orientarte, despejar tus inquietudes y coordinar una primera escucha. Responderé a la brevedad.</p>
            <div className="mt-6 flex flex-wrap gap-2.5 md:gap-3">
              <a href={`https://wa.me/${contacto.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-lila-900 text-white font-medium px-4 py-2.5 text-xs md:px-6 md:py-3 md:text-sm rounded-full hover:bg-lila-700 transition whitespace-nowrap"><MessageCircleHeart size={16} /> WhatsApp</a>
              <a href={`mailto:${contacto.email}`} className="inline-flex items-center gap-2 bg-white text-lila-900 font-medium px-4 py-2.5 text-xs md:px-6 md:py-3 md:text-sm rounded-full border border-lila-200 whitespace-nowrap"><Mail size={16} /> {contacto.email}</a>
            </div>
            <a href={contacto.mapsUrl} target="_blank" rel="noreferrer" className="mt-4 flex items-start gap-2 text-sm text-stone-600 hover:text-lila-900 transition"><MapPin size={16} className="mt-0.5 shrink-0 text-lila-700" /> <span>Atención presencial en <strong>CRyBE</strong> — {contacto.direccion}</span></a>
            <div className="mt-3 overflow-hidden rounded-2xl border border-lila-100 shadow-sm"><iframe title="Mapa CRyBE" src={`https://www.google.com/maps?q=${encodeURIComponent(contacto.direccion)}&output=embed`} className="w-full h-40" loading="lazy" /></div>
          </div>
          <div className="bg-white rounded-[24px] p-7 card-shadow">
            {sent ? (
              <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center gap-3"><span className="w-12 h-12 rounded-full bg-emerald-100 grid place-items-center"><Check size={22} className="text-emerald-700" /></span><p className="font-serif-display text-2xl text-lila-900">¡Mensaje enviado!</p><p className="text-sm text-stone-600">Te contactaremos muy pronto.</p><button onClick={() => setSent(false)} className="text-sm text-lila-700 underline mt-2">Volver</button></div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); setForm({ nombre: "", email: "", mensaje: "" }); }} className="space-y-4">
                <div><label className="text-[11px] tracking-[0.2em] uppercase text-lila-500 font-semibold block mb-1">Nombre</label><input type="text" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} required className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-lila-500 focus:ring-2 focus:ring-lila-100 bg-white" /></div>
                <div><label className="text-[11px] tracking-[0.2em] uppercase text-lila-500 font-semibold block mb-1">Email</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-lila-500 focus:ring-2 focus:ring-lila-100 bg-white" /></div>
                <div><label className="text-[11px] tracking-[0.2em] uppercase text-lila-500 font-semibold block mb-1">Mensaje</label><textarea rows={4} value={form.mensaje} onChange={(e) => setForm({...form, mensaje: e.target.value})} required className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-lila-500 focus:ring-2 focus:ring-lila-100 bg-white resize-none" /></div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-lila-900 text-white text-xs font-semibold tracking-[0.15em] px-6 py-3 rounded-full hover:bg-lila-700 transition">Enviar mensaje</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}