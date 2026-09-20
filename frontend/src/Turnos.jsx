import { useMemo, useState } from "react";
import { ArrowLeft, Building2, Video, Check } from "lucide-react";
import { useDatos } from "./DataContext.jsx";
import { api } from "./api.js";

const MODALIDADES = [
  { id: "presencial", label: "Presencial", icon: Building2 },
  { id: "online", label: "Online", icon: Video },
];

const SERVICIOS_TURNO = [
  "Evaluación Psicopedagógica",
  "Abordaje Temprano",
  "DIR Floortime",
  "Prácticas Inclusivas",
  "Adolescentes y Adultos",
  "Otro",
];

const HORAS_FALLBACK = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function proximasFechas(n = 10) {
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"];
  const out = [];
  const d = new Date();
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow >= 1 && dow <= 5) {
      out.push({
        id: d.toISOString().slice(0, 10),
        etiqueta: `${dias[dow]}, ${d.getDate()} ${meses[d.getMonth()]}`,
      });
    }
  }
  return out;
}

export default function Turnos() {
  const fechas = useMemo(() => proximasFechas(10), []);
  const { datos } = useDatos();
  const [modalidad, setModalidad] = useState("");
  const [servicio, setServicio] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [reservando, setReservando] = useState(false);
  const [errorReserva, setErrorReserva] = useState("");

  const numeroAdmin = datos.datosContacto?.whatsapp || "5491100000000";

  const reservar = async () => {
    setReservando(true);
    setErrorReserva("");
    try {
      await api.reservarTurno({ dia: diaDeFecha, hora, nombre: nombre.trim(), telefono: telefono.trim(), servicio, modalidad, fecha });
      setConfirmado(true);
    } catch (e) {
      setErrorReserva(e.message);
    } finally {
      setReservando(false);
    }
  };

  // Horas habilitadas por la admin para el día de la fecha elegida.
  // Si aún no cargó la config, se usa el fallback.
  const diaDeFecha = fecha ? DIAS_SEMANA[new Date(fecha + "T12:00:00").getDay()] : null;
  const horasHabilitadas = diaDeFecha
    ? (datos.horarios?.dias?.find((d) => d.dia === diaDeFecha)?.horas ?? HORAS_FALLBACK)
    : HORAS_FALLBACK;
  // Horas ocupadas (pendiente/confirmado) para ese día.
  const ocupadas = diaDeFecha
    ? new Set(
        Object.entries(datos.turnos || {})
          .flatMap(([, arr]) => arr || [])
          .filter((t) => (t.dia === diaDeFecha || (t.fecha && String(t.fecha).slice(0, 10) === fecha)) && ["pendiente", "confirmado"].includes(t.estado))
          .map((t) => t.hora)
      )
    : new Set();

  const paso = !modalidad ? 1 : !servicio ? 2 : !fecha || !hora ? 3 : 4;
  const completo = modalidad && servicio && fecha && hora && nombre.trim() && telefono.trim();

  const fechaLabel = fechas.find((f) => f.id === fecha)?.etiqueta ?? fecha;

  const textoPlano = `Hola! Reservé un turno por la web y quedó en estado PENDIENTE.\n- Modalidad: ${modalidad}\n- Servicio: ${servicio}\n- Fecha: ${fechaLabel} (${diaDeFecha})\n- Hora: ${hora}\n- Nombre: ${nombre}\n- Tel: ${telefono}`;
  const mensaje = encodeURIComponent(textoPlano);

  const pill = (active) =>
    `px-4 py-2.5 rounded-xl border text-[11px] font-semibold tracking-wide transition ${
      active
        ? "bg-lila-900 text-white border-lila-900 shadow"
        : "bg-white text-stone-600 border-stone-200 hover:border-lila-200 hover:bg-lila-50"
    }`;

  if (confirmado) {
    return (
      <div className="bg-lila-50/60 py-10 px-5">
        <div className="max-w-xl mx-auto bg-white rounded-[24px] card-shadow p-8 text-center">
          <span className="w-14 h-14 rounded-full bg-emerald-100 grid place-items-center mx-auto">
            <Check size={26} className="text-emerald-700" />
          </span>
          <h2 className="font-serif-display text-3xl text-lila-900 mt-4">¡Turno en estado pendiente!</h2>
          <p className="text-sm text-stone-600 mt-2">
            {nombre}, tu solicitud ya quedó registrada. En breve se comunicarán con vos por WhatsApp al {telefono} para pedirte datos y documentación y terminar de confirmar el turno.
          </p>
          <div className="mt-4 text-sm text-stone-700 bg-lila-50 rounded-2xl p-4 text-left space-y-1">
            <p><strong>Modalidad:</strong> {modalidad}</p>
            <p><strong>Servicio:</strong> {servicio}</p>
            <p><strong>Fecha:</strong> {fechaLabel}</p>
            <p><strong>Hora:</strong> {hora}</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 justify-center">
            <a
              href="#/"
              className="inline-flex justify-center items-center gap-2 pink-lavender-bg text-lila-900 font-semibold px-6 py-3 rounded-full text-sm hover:brightness-95 transition"
            >
              Volver al inicio
            </a>
            <p className="text-[11px] text-stone-400 text-center">
              ¿Preferís adelantar? <a href={`https://wa.me/${numeroAdmin}?text=${mensaje}`} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-lila-700">Escribinos por WhatsApp</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-lila-50/60 pb-16">
      <div className="max-w-6xl mx-auto px-5 pt-6">
        <a href="#/" className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-stone-500 hover:text-lila-700 transition">
          <ArrowLeft size={14} /> Volver al inicio
        </a>
        <p className="text-xs tracking-[0.2em] uppercase text-lila-500 font-semibold text-center mt-4">Turnos</p>
        <h2 className="font-serif-display text-3xl md:text-4xl text-lila-900 text-center mt-2">
          Reservá tu consulta
        </h2>
        <p className="text-sm text-stone-500 text-center mt-2 max-w-xl mx-auto">
          En simples pasos. Presencial en CRyBE (Tucumán 445, General Roca) u online.
        </p>

        <div className="flex items-center justify-center gap-2 mt-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold transition ${
                  paso >= n ? "bg-lila-900 text-white" : "bg-white text-stone-400 border border-stone-200"
                }`}
              >
                {n}
              </span>
              {n < 4 && <span className="w-8 h-px bg-lila-200" />}
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-[24px] card-shadow p-6 md:p-8 mt-6">
          <p className="text-[11px] tracking-[0.2em] uppercase text-lila-500 font-semibold">1 · Modalidad</p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {MODALIDADES.map((m) => (
              <button key={m.id} onClick={() => setModalidad(m.id)} className={pill(modalidad === m.id)}>
                <span className="inline-flex items-center gap-2 justify-center w-full">
                  <m.icon size={15} /> {m.label}
                </span>
              </button>
            ))}
          </div>

          <p className="text-[11px] tracking-[0.2em] uppercase text-lila-500 font-semibold mt-6">2 · Servicio</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {SERVICIOS_TURNO.map((s) => (
              <button key={s} onClick={() => setServicio(s)} className={pill(servicio === s)}>
                {s}
              </button>
            ))}
          </div>

          <p className="text-[11px] tracking-[0.2em] uppercase text-lila-500 font-semibold mt-6">3 · Fecha y horario</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
            {fechas.map((f) => (
              <button key={f.id} onClick={() => setFecha(f.id)} className={pill(fecha === f.id)}>
                {f.etiqueta}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {!fecha && <p className="text-xs text-stone-400">Elegí primero una fecha para ver los horarios disponibles.</p>}
            {fecha && !horasHabilitadas.length && <p className="text-xs text-stone-400">Ese día no hay horarios habilitados. Probá con otra fecha.</p>}
            {fecha && horasHabilitadas.map((h) => {
              const llena = ocupadas.has(h);
              return (
                <button key={h} disabled={llena} onClick={() => setHora(h)} title={llena ? "Horario ocupado" : ""} className={`${pill(hora === h)} ${llena ? "opacity-40 line-through cursor-not-allowed" : ""}`}>
                  {h}{llena ? " · ocupado" : ""}
                </button>
              );
            })}
          </div>

          <p className="text-[11px] tracking-[0.2em] uppercase text-lila-500 font-semibold mt-6">4 · Tus datos</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-lila-500 focus:ring-2 focus:ring-lila-100"
            />
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Tu teléfono / WhatsApp"
              className="rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-lila-500 focus:ring-2 focus:ring-lila-100"
            />
          </div>

          <button
            disabled={!completo || reservando}
            onClick={reservar}
            className="mt-6 w-full inline-flex justify-center items-center gap-2 pink-lavender-bg hover:brightness-95 transition text-lila-900 font-semibold px-6 py-3.5 rounded-full text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {reservando ? "Registrando..." : "Confirmar reserva →"}
          </button>
          {errorReserva && <p className="text-xs font-semibold text-red-600 text-center mt-3">{errorReserva}</p>}
          <p className="text-[11px] text-stone-400 text-center mt-3">
            Completá modalidad, servicio, fecha, horario y tus datos para confirmar.
          </p>
        </div>
      </div>
    </div>
  );
}
