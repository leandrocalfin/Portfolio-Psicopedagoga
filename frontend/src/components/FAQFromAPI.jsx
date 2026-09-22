import { useDatos } from "../DataContext.jsx";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useStaggeredReveal } from "../hooks/useScrollReveal.js";

export function FAQFromAPI() {
  const { datos } = useDatos();
  const faqs = datos.faqs || [];
  const [openIdx, setOpenIdx] = useState(0);

  const [setRef, visibleIndices] = useStaggeredReveal(faqs.length, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });

  if (!faqs.length) return <section id="faq" className="max-w-3xl mx-auto px-5 py-16 scroll-mt-20"><div className="text-center text-stone-500">Cargando preguntas...</div></section>;

  return (
    <section id="faq" className="max-w-3xl mx-auto px-5 py-16 scroll-mt-20">
      <p className="text-xs tracking-[0.2em] uppercase text-lila-500 font-semibold text-center">Preguntas</p>
      <h2 className="font-serif-display text-3xl md:text-4xl text-lila-900 text-center mt-2">Preguntas frecuentes</h2>
      <div className="mt-8 space-y-3">
        {faqs.map((f, i) => {
          const visible = visibleIndices.has(i);
          return (
            <div
              key={f._id || i}
              ref={setRef(i)}
              className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"} border rounded-2xl overflow-hidden ${openIdx === i ? "border-lila-200 bg-lila-50" : "border-stone-200 bg-white"}`}
            >
              <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-stone-800">
                {f.pregunta}
                <ChevronDown size={18} className={`shrink-0 transition ${openIdx === i ? "rotate-180" : ""}`} />
              </button>
              {openIdx === i && <p className="px-5 pb-5 text-sm text-stone-600 leading-relaxed">{f.respuesta}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}