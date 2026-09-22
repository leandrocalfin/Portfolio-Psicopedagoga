import { useEffect, useState } from "react";
import { useDatos } from "../DataContext.jsx";
import { MapPin, Video, School, Mail } from "lucide-react";

function WhatsAppIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const Br = () => <br className="hidden md:block" />;

// Cortes de línea solo en desktop: tras "los otros " y tras "; ".
function TituloConCortes({ texto }) {
  if (!texto.includes("los otros ") && !texto.includes("; ")) return texto;
  const [ini, resto = ""] = texto.split("los otros ");
  if (!resto) return texto;
  const [medio, fin] = resto.split("; ");
  return (
    <>
      {ini}los otros <Br />
      {medio}{fin !== undefined ? <>; <Br />{fin}</> : ""}
    </>
  );
}

export function HeroFromAPI() {
  const { datos, recargar } = useDatos();
  const mostrarTurnos = datos.config?.turnosHabilitados ?? true;
  const hero = datos.hero;

  const [idx, setIdx] = useState(0);

  const imagenes = hero?.imagenes || [];

  useEffect(() => {
    setIdx(0);
  }, [hero?._id]);

  useEffect(() => {
    if (imagenes.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % imagenes.length), 3800);
    return () => clearInterval(t);
  }, [imagenes.length]);

  if (!hero) return <div className="h-[70vh] flex items-center justify-center text-stone-500">Cargando hero...</div>;

  return (
    <section id="inicio" className="relative overflow-hidden bg-lila-50/60 md:min-h-[calc(100svh-7rem)] flex items-center scroll-mt-20">
      <div aria-hidden className="pointer-events-none absolute -top-10 right-[12%] w-72 h-72 rounded-full bg-rosa-100 blur-3xl opacity-70" />
      <div aria-hidden className="pointer-events-none absolute top-40 -left-16 w-72 h-72 rounded-full bg-lila-100 blur-3xl opacity-70" />
      <div aria-hidden className="pointer-events-none absolute top-1/4 -left-24 w-96 h-96 rounded-full blur-3xl opacity-60" style={{ background: "linear-gradient(135deg, #fbddec 0%, #f3e2f0 35%, #ddd0f7 100%)" }} />

      <div className={`max-w-6xl mx-auto px-4 sm:px-5 pt-2 pb-4 md:py-10 relative w-full flex flex-col gap-4 md:gap-6 lg:grid lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:gap-x-8 lg:gap-y-0 lg:items-center ${imagenes.length ? "" : "lg:grid-cols-1"}`}>
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <h1 className="font-serif-display italic text-xl sm:text-2xl md:text-[36px] leading-[1.2] text-lila-700 text-center lg:text-left [text-shadow:0_2px_16px_rgba(95,75,158,0.35)]">
            <TituloConCortes texto={hero.titulo} />
          </h1>
          <p className="mt-4 text-stone-700 text-xs md:text-[15px] leading-[1.7] text-center lg:text-left max-w-md mx-auto md:max-w-none lg:mx-0 lg:max-w-md">{hero.descripcion}</p>
          {datos.datosContacto && (
            <div className="mt-6 hidden lg:flex items-center gap-2.5 lg:mt-4">
              <a href={`https://wa.me/${datos.datosContacto.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp" className="w-10 h-10 rounded-full grid place-items-center text-white shadow-md hover:scale-110 hover:-translate-y-0.5 transition" style={{ backgroundColor: "#25D366" }}><WhatsAppIcon size={17} /></a>
              <a href={`mailto:${datos.datosContacto.email}`} aria-label={datos.datosContacto.email} title={datos.datosContacto.email} className="w-10 h-10 rounded-full grid place-items-center text-white shadow-md hover:scale-110 hover:-translate-y-0.5 transition" style={{ backgroundColor: "#EA4335" }}><Mail size={17} /></a>
              <a href={datos.datosContacto.instagram || "https://instagram.com/"} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" className="w-10 h-10 rounded-full grid place-items-center text-white shadow-md hover:scale-110 hover:-translate-y-0.5 transition" style={{ background: "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)" }}><InstagramIcon size={17} /></a>
            </div>
          )}
        </div>
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <div className="mt-1 md:mt-0 lg:mt-4 flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3">
            {mostrarTurnos && (
            <a href="#/turnos" className="relative inline-flex items-center gap-2 pink-lavender-bg hover:brightness-95 hover:scale-[1.04] transition text-lila-900 font-semibold px-4 py-2 md:px-7 md:py-3.5 rounded-full text-xs md:text-sm shadow-[0_6px_24px_rgba(95,75,158,0.45)]">
              <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lila-600 opacity-60" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lila-700" /></span>
              Solicitar turno →
            </a>
            )}
            <button onClick={() => document.querySelector("#servicios")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="inline-flex items-center gap-2 border-2 border-lila-200 hover:bg-lila-50 transition text-lila-900 px-4 py-2 md:px-6 md:py-3 rounded-xl text-xs md:text-sm font-semibold">
              Ver servicios
            </button>
          </div>
          <div className="mt-4 md:mt-4 lg:mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-4 text-[10px] md:text-xs text-stone-500">
            <span className="flex items-center gap-1.5"><MapPin size={14} /> Presencial en <span className="underline underline-offset-2">CRyBE</span></span>
            <span className="flex items-center gap-1.5"><Video size={14} /> Online</span>
            <span className="flex items-center gap-1.5"><School size={14} /> Niños, adolescentes y adultos</span>
          </div>
        </div>

        {imagenes.length > 0 && (
        <div className="relative w-full h-[380px] sm:h-[440px] md:h-[55vh] md:min-h-[420px] lg:h-[50vh] lg:min-h-[480px] lg:col-start-2 lg:row-start-1 lg:row-span-2 overflow-hidden" style={{ borderRadius: "28px" }}>
          {imagenes.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt={`Hero ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover will-change-transform transition-all duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${i === (idx % imagenes.length) ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]"}`}
              style={{ borderRadius: "28px", maskImage: "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, black 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, black 92%, transparent 100%)", maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
            />
          ))}
          {imagenes.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imagenes.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} aria-label={`Ver imagen ${i + 1}`} className={`h-2 rounded-full transition-all ${i === (idx % imagenes.length) ? "w-6 bg-lila-700" : "w-2 bg-white/80"}`} />
            ))}
          </div>
          )}
          <div aria-hidden className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-20 md:w-64 md:h-32 overflow-hidden pointer-events-none">
            <div
              className="w-40 h-40 md:w-64 md:h-64 rounded-full mx-auto"
              style={{
                background: "conic-gradient(from 180deg, #ff6b6b, #ffb84d, #ffe66d, #7bd88a, #5aa9ff, #b388ff, #ff6b6b)",
                maskImage: "radial-gradient(circle, transparent 62%, black 63%)",
                WebkitMaskImage: "radial-gradient(circle, transparent 62%, black 63%)",
              }}
            />
          </div>
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "28px",
              background: "linear-gradient(to bottom, transparent 78%, rgba(255,255,255,0.9) 100%)",
              maskImage: "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, black 92%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, black 92%, transparent 100%)",
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
            }}
          />
        </div>
        )}
      </div>
    </section>
  );
}