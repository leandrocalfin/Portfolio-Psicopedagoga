import { useDatos } from "../DataContext.jsx";
import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { useStaggeredReveal } from "../hooks/useScrollReveal.js";

export function InformacionFromAPI() {
  const { datos } = useDatos();
  const articulos = datos.articulos || [];
  const [sel, setSel] = useState(-1);
  const [porPagina, setPorPagina] = useState(() => (typeof window !== "undefined" && window.innerWidth < 1024 ? 6 : 8));
  const [pagina, setPagina] = useState(0);

  useEffect(() => {
    const onResize = () => setPorPagina(window.innerWidth < 1024 ? 6 : 8);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const ordenados = [...articulos].reverse();
  const totalPaginas = Math.ceil(ordenados.length / porPagina);
  const inicio = pagina * porPagina;
  const visibles = ordenados.slice(inicio, inicio + porPagina);
  const irA = (p) => { setPagina(p); document.getElementById("informacion")?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  const [setRef, visibleIndices] = useStaggeredReveal(visibles.length, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });

  if (!articulos.length) return <section id="informacion" className="bg-lila-50/60 py-16 scroll-mt-20"><div className="max-w-6xl mx-auto px-5 text-center text-stone-500">Cargando artículos...</div></section>;

  return (
    <section id="informacion" className="bg-lila-50/60 py-16 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5">
        <p className="text-xs tracking-[0.2em] uppercase text-lila-500 font-semibold text-center">Información</p>
        <h2 className="font-serif-display text-3xl md:text-4xl text-lila-900 text-center mt-2">Información, tips y recomendaciones</h2>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {visibles.map((a, i) => {
            const visible = visibleIndices.has(i);
            return (
              <article
                key={a._id || inicio + i}
                ref={setRef(i)}
                onClick={() => setSel(inicio + i)}
                className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"}`}
              >
                <div className="bg-white rounded-2xl overflow-hidden card-shadow hover:-translate-y-1 transition flex flex-col cursor-pointer">
                  {a.imagen && <img src={a.imagen} alt={a.titulo} className="w-full h-40 object-contain bg-lila-50/60" />}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-serif-display text-lg leading-snug text-lila-900 mt-1 line-clamp-2">{a.titulo}</h3>
                    <p className="text-[13px] text-stone-600 mt-1.5 leading-relaxed flex-1 line-clamp-2">{a.descripcion}</p>
                    <span className="mt-3 self-center text-[13px] font-semibold text-lila-700 underline underline-offset-4">Leer más</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {totalPaginas > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button onClick={() => irA(Math.max(0, pagina - 1))} disabled={pagina === 0} className="text-sm font-medium px-5 py-2.5 rounded-full border border-lila-200 bg-white text-lila-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-lila-50 transition">← Anterior</button>
            <span className="text-xs text-stone-500">Página {pagina + 1} de {totalPaginas}</span>
            <button onClick={() => irA(Math.min(totalPaginas - 1, pagina + 1))} disabled={pagina === totalPaginas - 1} className="text-sm font-medium px-5 py-2.5 rounded-full pink-lavender-bg text-lila-900 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-95 transition">Siguiente →</button>
          </div>
        )}
      </div>
      {sel >= 0 && ordenados[sel] && (
        <div className="fixed inset-0 z-[60] bg-black/60 grid place-items-center p-4 overflow-y-auto" onClick={() => setSel(-1)}>
          <div className="relative max-w-5xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSel(-1)} aria-label="Cerrar" className="absolute -top-5 right-4 z-10 w-11 h-11 rounded-full bg-white text-lila-900 grid place-items-center shadow-xl hover:scale-105 transition"><X size={24} /></button>
            <div className="bg-white rounded-[24px] w-full overflow-hidden grid md:grid-cols-[45%_1fr]">
              <div className="bg-white flex items-center justify-center p-6 md:p-8">
                {ordenados[sel].imagen && <img src={ordenados[sel].imagen} alt={ordenados[sel].titulo} className="w-full max-h-[70vh] object-contain" />}
              </div>
              <div className="p-7 md:p-9 md:max-h-[80vh] md:overflow-y-auto">
                <h3 className="font-serif-display text-2xl md:text-3xl text-lila-900 mt-1">{ordenados[sel].titulo}</h3>
                <p className="mt-4 text-[15px] text-stone-600 leading-relaxed whitespace-pre-line">{ordenados[sel].descripcion}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}