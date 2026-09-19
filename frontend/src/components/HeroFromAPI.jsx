import { useEffect } from "react";
import { useDatos } from "../DataContext.jsx";
import { MapPin, Video, School } from "lucide-react";

export function HeroFromAPI() {
  const { datos, recargar } = useDatos();
  const hero = datos.hero;

  if (!hero) return <div className="h-[70vh] flex items-center justify-center text-stone-500">Cargando hero...</div>;

  const imagenes = hero.imagenes?.length ? hero.imagenes : ["/hero-placeholder.jpg"];

  return (
    <section id="inicio" className="relative overflow-hidden bg-lila-50/60 md:min-h-[calc(100svh-7rem)] flex items-center scroll-mt-20">
      <div aria-hidden className="pointer-events-none absolute -top-10 right-[12%] w-72 h-72 rounded-full bg-rosa-100 blur-3xl opacity-70" />
      <div aria-hidden className="pointer-events-none absolute top-40 -left-16 w-72 h-72 rounded-full bg-lila-100 blur-3xl opacity-70" />
      <div aria-hidden className="pointer-events-none absolute top-1/4 -left-24 w-96 h-96 rounded-full blur-3xl opacity-60" style={{ background: "linear-gradient(135deg, #fbddec 0%, #f3e2f0 35%, #ddd0f7 100%)" }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-5 pt-2 pb-4 md:py-10 grid grid-cols-2 gap-4 md:gap-8 items-center relative w-full">
        <div>
          <h1 className="font-serif-display italic text-xl sm:text-2xl md:text-[36px] leading-[1.2] text-lila-700 [text-shadow:0_2px_16px_rgba(95,75,158,0.35)]">
            {hero.titulo}
          </h1>
          <p className="mt-4 text-stone-700 text-xs md:text-[15px] leading-[1.7] max-w-md">{hero.descripcion}</p>
          <div className="mt-5 md:mt-7 flex flex-wrap gap-2 md:gap-3">
            <a href="#/turnos" className="inline-flex items-center gap-2 pink-lavender-bg hover:brightness-95 transition text-lila-900 font-medium px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm">
              Solicitar turno
            </a>
            <a href="#servicios" className="inline-flex items-center gap-2 border-2 border-lila-200 hover:bg-lila-50 transition text-lila-900 px-4 py-2 md:px-6 md:py-3 rounded-xl text-xs md:text-sm font-semibold">
              Ver servicios
            </a>
          </div>
          <div className="mt-5 md:mt-6 flex flex-wrap items-center gap-2 md:gap-4 text-[10px] md:text-xs text-stone-500">
            <span className="flex items-center gap-1.5"><MapPin size={14} /> Presencial en <a href="#" className="underline underline-offset-2 hover:text-lila-700 transition">CRyBE</a></span>
            <span className="flex items-center gap-1.5"><Video size={14} /> Online</span>
            <span className="flex items-center gap-1.5"><School size={14} /> Niños, adolescentes y adultos</span>
          </div>
        </div>

        <div className="relative w-full h-[380px] sm:h-[440px] md:h-[70vh] md:min-h-[520px]">
          <div aria-hidden className="absolute inset-x-4 top-6 bottom-0 bg-gradient-to-br from-rosa-100 via-white to-lila-100 rounded-[28px]" />
          {imagenes.map((img, i) => (
            <img
              key={img}
              src={img}
              alt={`Hero ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === 0 ? "opacity-100" : "opacity-0"}`}
              style={{ borderRadius: "28px", maskImage: "linear-gradient(to right, transparent 0, black 15%), linear-gradient(to bottom, black 82%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0, black 15%), linear-gradient(to bottom, black 82%, transparent 100%)", maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
            />
          ))}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imagenes.map((_, i) => (
              <button key={i} aria-label={`Ver imagen ${i + 1}`} className={`h-2 rounded-full transition-all ${i === 0 ? "w-6 bg-lila-700" : "w-2 bg-white/80"}`} />
            ))}
          </div>
          <div aria-hidden className="absolute bottom-4 md:bottom-6 -right-2 w-28 h-14 md:w-48 md:h-24 overflow-hidden">
            <div className="w-28 h-28 md:w-48 md:h-48 rounded-full mx-auto" style={{ background: "conic-gradient(from 180deg, #ff6b6b, #ffb84d, #ffe66d, #7bd88a, #5aa9ff, #b388ff, #ff6b6b)", maskImage: "radial-gradient(circle, transparent 58%, black 59%)", WebkitMaskImage: "radial-gradient(circle, transparent 58%, black 59%)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}