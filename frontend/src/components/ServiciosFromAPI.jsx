import { useDatos } from "../DataContext.jsx";
import { Brain, Baby, HeartHandshake, GraduationCap, MessageCircleHeart } from "lucide-react";

const iconMap = { Brain, Baby, HeartHandshake, GraduationCap, MessageCircleHeart };

export function ServiciosFromAPI() {
  const { datos } = useDatos();
  const servicios = datos.servicios || [];

  if (!servicios.length) return <div className="pink-lavender-bg py-16 md:py-20"><div className="max-w-6xl mx-auto px-5 text-center text-stone-500">Cargando servicios...</div></div>;

  return (
    <section id="servicios" className="pink-lavender-bg py-16 md:py-20 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5">
        <p className="text-xs tracking-[0.2em] uppercase text-lila-500 font-semibold text-center">Servicios</p>
        <h2 className="font-serif-display text-center text-2xl md:text-3xl text-lila-900 mt-2">¿Cómo puedo ayudarte?</h2>
        <div className="mt-8 md:mt-10 grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 justify-center">
          {servicios.map((s) => (
            <div key={s._id || s.titulo} className="bg-white rounded-2xl p-4 md:p-7 text-center card-shadow hover:-translate-y-1 transition">
              {s.icono && iconMap[s.icono] && (() => { const Icon = iconMap[s.icono]; return <Icon size={22} className="mx-auto text-lila-500 md:w-[26px] md:h-[26px]" />; })()}
              <h3 className="font-serif-display text-base md:text-xl text-lila-500 mt-2 md:mt-3">{s.titulo}</h3>
              <p className="text-xs md:text-sm text-stone-600 mt-1.5 md:mt-2 leading-relaxed">{s.descripcion}</p>
            </div>
          ))}
          <div className="bg-lila-900 text-white rounded-2xl p-4 md:p-7 text-center card-shadow flex flex-col justify-center">
            <p className="font-serif-display text-lg md:text-2xl">Consultas y Orientación</p>
            <p className="text-xs md:text-sm text-white/80 mt-2">Contanos tu caso y busquemos juntos el mejor camino a seguir.</p>
            <button onClick={() => document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="mt-3 md:mt-4 inline-flex justify-center items-center gap-2 bg-white text-lila-900 text-xs md:text-sm font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-full">Consultar</button>
          </div>
        </div>
      </div>
    </section>
  );
}