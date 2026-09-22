import { useEffect, useState } from "react";
import { useDatos } from "../DataContext.jsx";
import { MapPin, Video, School } from "lucide-react";

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

      <div className={`max-w-6xl mx-auto px-4 sm:px-5 pt-2 pb-4 md:py-10 grid gap-4 md:gap-8 items-center relative w-full ${imagenes.length ? "grid-cols-2" : "grid-cols-1"}`}>
        <div>
          <h1 className="font-serif-display italic text-xl sm:text-2xl md:text-[36px] leading-[1.2] text-lila-700 [text-shadow:0_2px_16px_rgba(95,75,158,0.35)]">
            <TituloConCortes texto={hero.titulo} />
          </h1>
          <p className="mt-4 text-stone-700 text-xs md:text-[15px] leading-[1.7] max-w-md">{hero.descripcion}</p>
          <div className="mt-5 md:mt-7 flex flex-wrap gap-2 md:gap-3">
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
          <div className="mt-5 md:mt-6 flex flex-wrap items-center gap-2 md:gap-4 text-[10px] md:text-xs text-stone-500">
            <span className="flex items-center gap-1.5"><MapPin size={14} /> Presencial en <span className="underline underline-offset-2">CRyBE</span></span>
            <span className="flex items-center gap-1.5"><Video size={14} /> Online</span>
            <span className="flex items-center gap-1.5"><School size={14} /> Niños, adolescentes y adultos</span>
          </div>
        </div>

        {imagenes.length > 0 && (
        <div className="relative w-full h-[380px] sm:h-[440px] md:h-[55vh] md:min-h-[420px] lg:h-[50vh] lg:min-h-[480px] overflow-hidden" style={{ borderRadius: "28px" }}>
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