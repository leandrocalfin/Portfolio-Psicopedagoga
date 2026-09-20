import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDatos } from "../DataContext.jsx";

export function AnuncioFlotante() {
  const { datos } = useDatos();
  const [indice, setIndice] = useState(0);
  const [cerrados, setCerrados] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("anuncios-cerrados") || "[]"); }
    catch { return []; }
  });

  const activos = (datos.anuncios || []).filter((a) => a.activo && !cerrados.includes(a._id));
  const actual = activos[indice] || null;

  useEffect(() => {
    setIndice(0);
    document.body.style.overflow = actual ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [actual?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!actual) return null;

  const cerrar = () => {
    const nuevos = [...cerrados, actual._id];
    setCerrados(nuevos);
    try { sessionStorage.setItem("anuncios-cerrados", JSON.stringify(nuevos)); } catch {}
    setIndice(0);
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-lila-900/50 backdrop-blur-sm px-5" onClick={cerrar}>
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md bg-white rounded-[24px] overflow-hidden shadow-2xl">
        <button onClick={cerrar} aria-label="Cerrar anuncio" className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 grid place-items-center text-stone-600 hover:text-lila-900 shadow transition z-10">
          <X size={18} />
        </button>
        {actual.imagen && <img src={actual.imagen} alt={actual.titulo} className="w-full max-h-64 object-cover" />}
        <div className="p-6 text-center">
          <h3 className="font-serif-display text-2xl text-lila-900">{actual.titulo}</h3>
          {actual.mensaje && <p className="text-sm text-stone-600 mt-2 leading-relaxed">{actual.mensaje}</p>}
          {activos.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {activos.map((a, i) => (
                <button key={a._id} onClick={() => setIndice(i)} aria-label={`Ver anuncio ${i + 1}`} className={`h-2 rounded-full transition-all ${i === indice ? "w-6 bg-lila-700" : "w-2 bg-stone-300"}`} />
              ))}
            </div>
          )}
          <button onClick={cerrar} className="mt-5 inline-flex items-center gap-2 pink-lavender-bg text-lila-900 font-semibold px-6 py-2.5 rounded-full text-sm hover:brightness-95 transition">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
