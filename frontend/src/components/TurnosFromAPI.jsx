import { useDatos } from "../DataContext.jsx";
import { CalendarDays, Check, X, Clock, AlertCircle } from "lucide-react";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function TurnosFromAPI() {
  const { datos } = useDatos();
  const turnos = datos.turnos || {};
  const horarios = datos.horarios?.dias || [];

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "confirmado": return <Check size={14} className="text-emerald-600" />;
      case "cancelado": return <X size={14} className="text-rose-600" />;
      case "completado": return <Check size={14} className="text-lila-600" />;
      default: return <Clock size={14} className="text-amber-600" />;
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case "confirmado": return "Confirmado";
      case "cancelado": return "Cancelado";
      case "completado": return "Completado";
      default: return "Pendiente";
    }
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case "confirmado": return "bg-emerald-100 text-emerald-800";
      case "cancelado": return "bg-rose-100 text-rose-800";
      case "completado": return "bg-lila-100 text-lila-800";
      default: return "bg-amber-100 text-amber-800";
    }
  };

  if (!Object.keys(turnos).length) return <section id="agenda" className="max-w-6xl mx-auto px-5 py-16 scroll-mt-20"><div className="text-center text-stone-500">Cargando agenda...</div></section>;

  return (
    <section id="agenda" className="max-w-6xl mx-auto px-5 py-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-lila-500 font-semibold">Agenda</p>
          <h2 className="font-serif-display text-3xl md:text-4xl text-lila-900 mt-1">Turnos de la semana</h2>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-[10px] sm:text-[11px] font-semibold bg-lila-100 text-lila-900 px-3 sm:px-4 py-1.5 rounded-full">
          {Object.values(turnos).flat().filter(t => t.estado === "confirmado").length} CONFIRMADOS
        </span>
        <span className="text-[10px] sm:text-[11px] font-semibold bg-rosa-100 text-lila-900 px-3 sm:px-4 py-1.5 rounded-full">
          {Object.values(turnos).flat().filter(t => t.estado === "pendiente").length} PENDIENTES
        </span>
      </div>
      <div className="xl:grid xl:grid-cols-5 gap-3 overflow-x-auto xl:overflow-visible pb-2 xl:pb-0 snap-x snap-mandatory w-full max-w-full">
        {DIAS.map(dia => {
          const turnosDia = turnos[dia] || [];
          const horasHabilitadas = horarios.find(h => h.dia === dia)?.horas || [];
          return (
            <div key={dia} className="min-w-[80%] sm:min-w-[calc(50%-6px)] xl:min-w-0 shrink-0 snap-start border border-stone-200 rounded-2xl overflow-hidden bg-white">
              <p className="text-[11px] font-bold tracking-[0.15em] text-center text-stone-500 bg-lila-50/60 py-2.5 uppercase">{dia}</p>
              <div className="p-2 space-y-2 max-h-[500px] overflow-y-auto">
                {turnosDia.length === 0 ? (
                  <p className="text-center text-stone-400 text-sm py-8">Sin turnos agendados</p>
                ) : (
                  turnosDia.map((t, i) => (
                    <div key={i} className="rounded-xl px-3 py-2 border border-stone-100">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-lila-900">{t.hora}</span>
                          <span className="text-[11px] font-medium text-stone-700">{t.nombre}{t.apellido ? ` ${t.apellido}` : ""}</span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getEstadoClass(t.estado)} flex items-center gap-1`}>
                          {getEstadoIcon(t.estado)}
                          {getEstadoLabel(t.estado)}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">{t.detalle}</p>
                      {t.fecha && <p className="text-[10px] text-stone-400 mt-1">{new Date(t.fecha).toLocaleDateString("es-AR")}</p>}
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-stone-100 p-2 bg-lila-50/30">
                <p className="text-[10px] font-semibold text-stone-500 mb-1">Horarios habilitados:</p>
                <div className="flex flex-wrap gap-1">
                  {horasHabilitadas.map(h => (
                    <span key={h} className="text-[10px] px-2 py-0.5 bg-lila-100 text-lila-800 rounded-full">{h}</span>
                  ))}
                  {!horasHabilitadas.length && <span className="text-[10px] text-stone-400">Sin horarios</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}