import { useDatos } from "../DataContext.jsx";
import { MapPin, Video, School, Check, X, ChevronDown, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

export function SobreMiFromAPI() {
  const { datos } = useDatos();
  const sobreMi = datos.sobreMi;
  const [libroModal, setLibroModal] = useState(false);
  const [libroIdx, setLibroIdx] = useState(0);

  if (!sobreMi) return <div className="relative overflow-hidden scroll-mt-20"><div className="max-w-6xl mx-auto px-5 pt-14 text-center text-stone-500">Cargando...</div></div>;

  const mostrarLibro = sobreMi.mostrarLibro !== false;
  const itemsBase = sobreMi.items || [];
  const tieneLibro = itemsBase.some((it) => /libro/i.test(it?.texto || ""));
  const items = !mostrarLibro ? itemsBase : tieneLibro ? itemsBase : [...itemsBase, { texto: "Autora del libro «¿Y por qué no a mí?»" }];
  const certificados = sobreMi.certificados || [];

  return (
    <section id="sobre-mi" className="relative overflow-hidden scroll-mt-20">
      <div aria-hidden className="pointer-events-none absolute -top-10 -right-20 w-96 h-96 rounded-full bg-rosa-100 blur-3xl opacity-70" />
      <div aria-hidden className="pointer-events-none absolute -bottom-10 -right-20 w-96 h-96 rounded-full blur-3xl opacity-60" style={{ background: "linear-gradient(135deg, #fbddec 0%, #f3e2f0 35%, #ddd0f7 100%)" }} />
      <div aria-hidden className="pointer-events-none absolute top-1/2 -translate-y-1/2 -left-28 w-[28rem] h-[28rem] rounded-full bg-lila-100 blur-3xl opacity-70" />
      <div className="max-w-6xl mx-auto px-5 pt-14 grid md:grid-cols-2 gap-10 items-center relative">
        <div className="md:hidden text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-lila-500 font-semibold">Sobre mí</p>
          <h2 className="font-serif-display text-2xl text-lila-900 mt-2">Aprender es un puente que se cruza de a dos</h2>
        </div>
        <div className="relative w-full max-w-[220px] md:max-w-[380px] mx-auto md:mx-0 md:w-full pr-2 pb-8 md:pr-3 md:pb-10 translate-x-1 md:translate-x-8 translate-y-1 md:translate-y-4">
          {sobreMi.imagen && (
            <img src={sobreMi.imagen} alt="Psicopedagoga" className="w-full h-auto rounded-[24px] shadow-[0_25px_60px_-15px_rgba(61,52,99,0.55),0_18px_35px_-18px_rgba(139,118,201,0.65)]" />
          )}
          {sobreMi.imagen && mostrarLibro && (
            <img
              src="/libro.png"
              alt="Libro ¿Y por qué no a mí?"
              onClick={() => setLibroModal(true)}
              className="absolute bottom-0 -right-3 md:-right-6 w-[42%] md:w-[40%] h-auto object-contain rounded-[16px] border-[5px] md:border-[6px] border-lila-200 bg-white shadow-xl cursor-pointer hover:scale-[1.02] transition"
            />
          )}
        </div>
        <div>
          <p className="hidden md:block text-xs tracking-[0.2em] uppercase text-lila-500 font-semibold">Sobre mí</p>
          <h2 className="hidden md:block font-serif-display text-3xl md:text-4xl text-lila-900 mt-2">{sobreMi.titulo || "Aprender es un puente que se cruza de a dos"}</h2>
          <p className="mt-4 text-stone-600 text-[15px] leading-relaxed">{sobreMi.descripcion}</p>
          <ul className="mt-5 space-y-2.5 text-sm text-stone-700">
            {items.map((item, i) => {
              const esLibro = /libro/i.test(item?.texto || "");
              const hasLink = !!(item?.link && item.link.trim());
              return (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 grid place-items-center shrink-0"><Check size={13} className="text-emerald-700" /></span>
                  {hasLink ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-lila-700 transition text-left">
                      {item.texto}
                    </a>
                  ) : esLibro ? (
                    <button onClick={() => { setLibroIdx(0); setLibroModal(true); }} className="underline underline-offset-2 hover:text-lila-700 transition text-left cursor-pointer">
                      {item.texto}
                    </button>
                  ) : (
                    item.texto
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs bg-lila-100 text-lila-900 px-3 py-1.5 rounded-full"><MapPin size={13} /> Atención en consultorio</span>
            <span className="inline-flex items-center gap-1.5 text-xs bg-rosa-100 text-lila-900 px-3 py-1.5 rounded-full"><Video size={13} /> Atención por Zoom/Meet</span>
          </div>
        </div>
      </div>
      <FormacionFromAPI certificados={certificados} />
      {libroModal && (
        <div className="fixed inset-0 z-[60] bg-black/80 grid place-items-center p-4" onClick={() => setLibroModal(false)}>
          <button aria-label="Cerrar" className="absolute top-4 right-4 w-10 h-10 rounded-full bg-neutral-900 text-white border border-white/20 grid place-items-center"><X size={20} /></button>
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-neutral-950 rounded-[24px] overflow-hidden border border-white/10">
              <button onClick={() => setLibroIdx((i) => (i - 1 + 10) % 10)} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 text-white border border-white/20 grid place-items-center shadow-lg hover:bg-black transition z-10" aria-label="Anterior"><ChevronDown size={24} className="rotate-90" /></button>
              <img src={`/libro${libroIdx + 1}.png`} alt={`Libro ${libroIdx + 1}`} className="w-full max-h-[75vh] object-contain" />
              <button onClick={() => setLibroIdx((i) => (i + 1) % 10)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 text-white border border-white/20 grid place-items-center shadow-lg hover:bg-black transition z-10" aria-label="Siguiente"><ChevronDown size={24} className="-rotate-90" /></button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <button key={i} onClick={() => setLibroIdx(i)} className={`h-2 rounded-full transition-all ${i === libroIdx ? "w-6 bg-white" : "w-2 bg-white/40"}`} aria-label={`Ver imagen ${i + 1}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function FormacionFromAPI({ certificados }) {
  const [sel, setSel] = useState(-1);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const LIMITE = 8;
  const visibles = mostrarTodos ? certificados : certificados.slice(0, LIMITE);
  const tieneMas = certificados.length > LIMITE;
  return (
    <section id="formacion" className="max-w-6xl mx-auto px-5 py-14 scroll-mt-20 relative z-10">
      <p className="text-xs tracking-[0.2em] uppercase text-lila-500 font-semibold text-center">Mi formación</p>
      <h2 className="font-serif-display text-3xl md:text-4xl text-lila-900 mt-2 text-center">Certificados que respaldan mi práctica</h2>
      <div className={`mt-8 mx-auto flex flex-wrap justify-center gap-3 md:gap-5 ${visibles.length > 6 ? "max-w-5xl" : "max-w-3xl"}`}>
        {visibles.map((c, i) => {
          const idxReal = certificados.indexOf(c);
          return (
            <button
              key={c._id || i}
              onClick={() => setSel(idxReal >= 0 ? idxReal : i)}
              className={`bg-white rounded-2xl overflow-hidden border border-lila-100 shadow-[0_18px_40px_-16px_rgba(95,75,158,0.45)] hover:shadow-[0_22px_48px_-14px_rgba(95,75,158,0.55)] hover:-translate-y-1 transition text-left ${visibles.length > 6 ? "w-[calc(50%-6px)] md:w-[calc(25%-15px)]" : "w-[calc(50%-6px)] lg:w-[calc(33.333%-14px)]"} max-w-[320px]`}
            >
              {c.imagen && <img src={c.imagen} alt={c.titulo} className="w-full h-20 md:h-32 object-cover object-top" />}
              <span className="block p-2.5 md:p-4">
                <strong className="block text-xs md:text-sm text-stone-800 leading-snug">{c.titulo}</strong>
                <span className="block text-[10px] md:text-xs text-stone-500 mt-1">{c.organizacion}</span>
              </span>
            </button>
          );
        })}
      </div>
      {tieneMas && (
        <div className="text-center mt-8">
          {!mostrarTodos ? (
            <button onClick={() => setMostrarTodos(true)} className="inline-flex items-center gap-2 bg-lila-900 text-white text-xs font-semibold tracking-[0.12em] px-6 py-3 rounded-full hover:bg-lila-700 transition">
              Ver más ({certificados.length - LIMITE} más)
            </button>
          ) : (
            <button onClick={() => setMostrarTodos(false)} className="inline-flex items-center gap-2 bg-white border border-lila-200 text-lila-900 text-xs font-semibold tracking-[0.12em] px-6 py-3 rounded-full hover:bg-lila-50 transition">
              Ver menos
            </button>
          )}
        </div>
      )}
      {sel >= 0 && certificados[sel]?.imagen && (
        <div className="fixed inset-0 z-[60] bg-black/80 grid place-items-center p-4" onClick={() => setSel(-1)}>
          <button aria-label="Cerrar" className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-stone-800 grid place-items-center"><X size={20} /></button>
          <img src={certificados[sel].imagen} alt={certificados[sel].titulo} className="max-w-full max-h-[85vh] rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}