import { useEffect, useState } from "react";
import {
  Home,
  User,
  Stethoscope,
  Info,
  Settings,
  CalendarDays,
  Save,
  Plus,
  Trash2,
  Pencil,
  Image as ImageIcon,
} from "lucide-react";

const SECCIONES = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "sobre-mi", label: "Sobre mí", icon: User },
  { id: "servicios", label: "Servicios", icon: Stethoscope },
  { id: "informacion", label: "Información", icon: Info },
  { id: "datos", label: "Datos y redes", icon: Settings },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
];

const INFO_INICIAL = [
  { titulo: "TDAH: nadie regula solo", tag: "TDAH" },
  { titulo: "Tips para el comienzo de clases con niños neurodivergentes", tag: "Tips" },
  { titulo: "Día 2: cambiar la mirada sobre el autismo", tag: "Neurodiversidad" },
  { titulo: "Día Nacional de Concientización sobre TDAH", tag: "TDAH" },
  { titulo: "Septiembre, Mes de la Psicopedagogía", tag: "Profesión" },
  { titulo: "Hola, soy Estefy: psicopedagogía y equinoterapia", tag: "Presentación" },
  { titulo: "El caballo no enseña con palabras, enseña con presencia", tag: "Equinoterapia" },
  { titulo: "Psicopedagogía y equinoterapia", tag: "Equinoterapia" },
  { titulo: "Día Mundial del Síndrome de Down – 21 de marzo", tag: "Efeméride" },
  { titulo: "Escuchar a las personas autistas", tag: "Neurodiversidad" },
  { titulo: "La importancia del diagnóstico a edad temprana", tag: "TDA" },
  { titulo: "Evaluación ADOS-2", tag: "Evaluación" },
  { titulo: "Un dibujo no es solo trazos de colores", tag: "Vínculo" },
  { titulo: "Septiembre, mes de la Psicopedagogía", tag: "Efeméride" },
  { titulo: "Reconocimiento de la Legislatura de Río Negro a mi libro", tag: "Libro" },
  { titulo: "Los navegantes: fábula con reflexión", tag: "Reflexión" },
  { titulo: "Evaluación rutinaria del desarrollo", tag: "Enfoque" },
  { titulo: "Autismo: desarrollo simbólico e indicadores tempranos", tag: "Detección" },
  { titulo: "¿Quiénes pueden asistir al psicopedagog@?", tag: "Rompiendo mitos" },
];

const AGENDA_DEMO = {
  Lun: [
    { hora: "09:00", nombre: "Juan Pérez", detalle: "Evaluación", estado: "pendiente" },
    { hora: "10:00", nombre: "Diego Torres", detalle: "Seguimiento", estado: "pendiente" },
    { hora: "11:00", nombre: "Carlos Ruiz", detalle: "Seguimiento", estado: "pendiente" },
  ],
  Mar: [
    { hora: "09:00", nombre: "Lucía Díaz", detalle: "Primera escucha", estado: "pendiente" },
    { hora: "10:00", nombre: "María Gómez", detalle: "Seguimiento", estado: "pendiente" },
    { hora: "11:00", nombre: "Sofía Méndez", detalle: "Online", estado: "pendiente" },
  ],
  Mié: [
    { hora: "15:00", nombre: "Lucía Díaz", detalle: "Primera escucha", estado: "confirmado" },
    { hora: "16:00", nombre: "María Gómez", detalle: "Online", estado: "confirmado" },
    { hora: "17:00", nombre: "Sofía Méndez", detalle: "Evaluación", estado: "confirmado" },
  ],
  Jue: [
    { hora: "09:00", nombre: "Pedro Sosa", detalle: "Seguimiento", estado: "confirmado" },
    { hora: "11:00", nombre: "Diego Torres", detalle: "Apoyo escolar", estado: "confirmado" },
    { hora: "12:00", nombre: "Carlos Ruiz", detalle: "Evaluación", estado: "confirmado" },
  ],
  Vie: [
    { hora: "08:00", nombre: "Ana López", detalle: "Online", estado: "pendiente" },
    { hora: "09:00", nombre: "Elena Castro", detalle: "Primera escucha", estado: "pendiente" },
    { hora: "11:00", nombre: "María Gómez", detalle: "Primera consulta", estado: "pendiente" },
  ],
};

const HORARIOS_INICIAL = {
  Lun: ["09:00", "10:00", "11:00", "12:00", "13:00"],
  Mar: ["09:00", "10:00", "11:00", "12:00", "13:00"],
  Mié: ["14:00", "15:00", "16:00", "17:00"],
  Jue: ["09:00", "10:00", "11:00", "12:00", "13:00"],
  Vie: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
};

const inputCls =
  "w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-lila-500 focus:ring-2 focus:ring-lila-100 bg-white";
const labelCls = "text-[11px] tracking-[0.2em] uppercase text-lila-500 font-semibold";

function Guardar({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-lila-900 text-white text-xs font-semibold tracking-[0.15em] px-6 py-3 rounded-full hover:bg-lila-700 transition"
    >
      <Save size={15} /> GUARDAR
    </button>
  );
}

export default function Admin() {
  const [seccion, setSeccion] = useState("inicio");
  const [aviso, setAviso] = useState("");
  useEffect(() => {
    const ir = (e) => {
      if (typeof e.detail === "string") {
        setSeccion(e.detail);
        setAviso("");
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener("admin-go", ir);
    return () => window.removeEventListener("admin-go", ir);
  }, []);
  const avisar = () => {
    setAviso("Modo demo · no guarda cambios reales");
    setTimeout(() => setAviso(""), 2500);
  };

  const [hero, setHero] = useState({
    titulo: "Para comprender el lenguaje de los otros no es suficiente comprender las palabras; es necesario entender su pensamiento.",
    descripcion: "Atención a niños, adolescentes y adultos con desafíos en el desarrollo.",
    imagen: "",
  });
  const [sobreMi, setSobreMi] = useState({
    titulo: "Aprender es un puente que se cruza de a dos",
    descripcion: "Soy Estefani, psicopedagoga. Acompaño a niños, adolescentes y adultos con desafíos en el desarrollo.",
    imagen: "",
  });
  const [servicios, setServicios] = useState([
    { titulo: "Evaluación Psicopedagógica", desc: "Valoración integral del desarrollo y los procesos de aprendizaje." },
    { titulo: "Abordaje Temprano", desc: "Intervención en los primeros años y apoyo en hitos del desarrollo." },
    { titulo: "DIR Floortime", desc: "Abordaje clínico basado en el juego, el vínculo y el desarrollo emocional." },
    { titulo: "Prácticas Inclusivas", desc: "Acompañamiento escolar y estrategias de integración." },
    { titulo: "Adolescentes y Adultos", desc: "Apoyo en aprendizaje, autonomía y proyectos de vida." },
  ]);
  const [info, setInfo] = useState(INFO_INICIAL);
  const [nuevoInfo, setNuevoInfo] = useState({ titulo: "", tag: "", texto: "", imagen: "", nombreImg: "" });
  const [mostrarFormInfo, setMostrarFormInfo] = useState(false);
  const [paginaInfo, setPaginaInfo] = useState(0);
  const POR_PAGINA_INFO = 10;
  const [datos, setDatos] = useState({
    whatsapp: "5491100000000",
    email: "hola@estefanisalaya.com",
    direccion: "Tucumán 445, General Roca, Río Negro 8332",
    instagram: "https://instagram.com/",
    horarios: "Lun a Vie · 9 a 18 hs",
  });
  const [horarios, setHorarios] = useState(HORARIOS_INICIAL);

  const toggleHorario = (dia, h) => {
    setHorarios((prev) => ({
      ...prev,
      [dia]: prev[dia].includes(h) ? prev[dia].filter((x) => x !== h) : [...prev[dia], h].sort(),
    }));
  };

  const descripciones = {
    inicio: "Título, descripción e imagen principal del inicio.",
    "sobre-mi": "Título, descripción y foto de la sección Sobre mí.",
    servicios: "Títulos y descripciones de los servicios.",
    informacion: "Artículos de Información, tips y recomendaciones.",
    datos: "WhatsApp, email, dirección, redes y horarios.",
    agenda: "Turnos de la semana y horarios habilitados.",
  };

  return (
    <div className="bg-lila-50/60 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-6 grid md:grid-cols-[240px_minmax(0,1fr)] gap-5 items-start w-full min-w-0">
        <nav className="hidden md:block space-y-2.5 min-w-0">
          {SECCIONES.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSeccion(s.id); setAviso(""); }}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-xs font-semibold tracking-[0.15em] transition ${
                seccion === s.id ? "bg-lila-900 text-white shadow" : "bg-white text-stone-600 hover:bg-lila-100"
              }`}
            >
              <s.icon size={17} /> {s.label}
            </button>
          ))}
        </nav>

        <div className="bg-white rounded-[24px] card-shadow p-4 sm:p-6 md:p-8 min-h-[480px] min-w-0 max-w-full overflow-hidden">
          <h2 className="font-serif-display text-2xl text-lila-900 capitalize">
            {SECCIONES.find((s) => s.id === seccion)?.label}
          </h2>
          <p className="text-sm text-stone-500 mt-1">{descripciones[seccion]}</p>
          {aviso && (
            <p className="mt-3 text-xs font-semibold bg-rosa-100 text-lila-900 px-4 py-2.5 rounded-xl">{aviso}</p>
          )}

          {seccion === "inicio" && (
            <div className="mt-6 space-y-5">
              <div><p className={labelCls}>Título principal</p><textarea rows={3} value={hero.titulo} onChange={(e) => setHero({ ...hero, titulo: e.target.value })} className={`${inputCls} mt-2 resize-none`} /></div>
              <div><p className={labelCls}>Descripción</p><textarea rows={3} value={hero.descripcion} onChange={(e) => setHero({ ...hero, descripcion: e.target.value })} className={`${inputCls} mt-2 resize-none`} /></div>
              <div className="min-w-0"><p className={labelCls}>Imagen (URL o archivo)</p>
                <div className="flex gap-2 mt-2 min-w-0"><input value={hero.imagen} onChange={(e) => setHero({ ...hero, imagen: e.target.value })} placeholder="https://... o elegí un archivo" className={`${inputCls} min-w-0 flex-1`} /><span className="w-12 h-12 shrink-0 rounded-xl bg-lila-100 grid place-items-center text-lila-700"><ImageIcon size={18} /></span></div>
              </div>
              <Guardar onClick={avisar} />
            </div>
          )}

          {seccion === "sobre-mi" && (
            <div className="mt-6 space-y-5">
              <div><p className={labelCls}>Título</p><input value={sobreMi.titulo} onChange={(e) => setSobreMi({ ...sobreMi, titulo: e.target.value })} className={`${inputCls} mt-2`} /></div>
              <div><p className={labelCls}>Descripción</p><textarea rows={4} value={sobreMi.descripcion} onChange={(e) => setSobreMi({ ...sobreMi, descripcion: e.target.value })} className={`${inputCls} mt-2 resize-none`} /></div>
              <div className="min-w-0"><p className={labelCls}>Foto (URL o archivo)</p>
                <div className="flex gap-2 mt-2 min-w-0"><input value={sobreMi.imagen} onChange={(e) => setSobreMi({ ...sobreMi, imagen: e.target.value })} placeholder="https://... o elegí un archivo" className={`${inputCls} min-w-0 flex-1`} /><span className="w-12 h-12 shrink-0 rounded-xl bg-lila-100 grid place-items-center text-lila-700"><ImageIcon size={18} /></span></div>
              </div>
              <Guardar onClick={avisar} />
            </div>
          )}

          {seccion === "servicios" && (
            <div className="mt-6 space-y-3">
              {servicios.map((s, i) => (
                <div key={i} className="border border-stone-200 rounded-2xl p-3 sm:p-4 grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 items-center min-w-0">
                  <input value={s.titulo} onChange={(e) => setServicios(servicios.map((x, j) => (j === i ? { ...x, titulo: e.target.value } : x)))} className={`${inputCls} min-w-0`} />
                  <input value={s.desc} onChange={(e) => setServicios(servicios.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)))} className={`${inputCls} min-w-0`} />
                  <button onClick={() => setServicios(servicios.filter((_, j) => j !== i))} aria-label="Eliminar" className="w-10 h-10 rounded-xl bg-rosa-100 text-lila-900 grid place-items-center hover:brightness-95"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => setServicios([...servicios, { titulo: "Nuevo servicio", desc: "Descripción…" }])} className="inline-flex items-center gap-2 text-xs font-semibold text-lila-700 hover:text-lila-900"><Plus size={15} /> Agregar servicio</button>
              <div className="pt-2"><Guardar onClick={avisar} /></div>
            </div>
          )}

          {seccion === "informacion" && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-stone-500">{info.length} artículos</p>
                <button
                  onClick={() => setMostrarFormInfo(!mostrarFormInfo)}
                  className="inline-flex items-center gap-2 bg-lila-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-lila-700 transition"
                >
                  <Plus size={15} /> {mostrarFormInfo ? "Cerrar formulario" : "Agregar Nuevo"}
                </button>
              </div>

              {mostrarFormInfo && (
                <div className="border border-lila-200 bg-lila-50/60 rounded-2xl p-5 space-y-4">
                  <div>
                    <p className={labelCls}>Título</p>
                    <input
                      value={nuevoInfo.titulo}
                      onChange={(e) => setNuevoInfo({ ...nuevoInfo, titulo: e.target.value })}
                      placeholder="Título del artículo"
                      className={`${inputCls} mt-2`}
                    />
                  </div>
                  <div>
                    <p className={labelCls}>Etiqueta</p>
                    <input
                      value={nuevoInfo.tag}
                      onChange={(e) => setNuevoInfo({ ...nuevoInfo, tag: e.target.value })}
                      placeholder="Ej: Tips, TDAH, Neurodiversidad…"
                      className={`${inputCls} mt-2`}
                    />
                  </div>
                  <div>
                    <p className={labelCls}>Texto</p>
                    <textarea
                      rows={4}
                      value={nuevoInfo.texto}
                      onChange={(e) => setNuevoInfo({ ...nuevoInfo, texto: e.target.value })}
                      placeholder="Contenido del artículo…"
                      className={`${inputCls} mt-2 resize-none`}
                    />
                  </div>
                  <div>
                    <p className={labelCls}>Imagen</p>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        value={nuevoInfo.imagen.startsWith("blob:") ? "" : nuevoInfo.imagen}
                        onChange={(e) => setNuevoInfo({ ...nuevoInfo, imagen: e.target.value, nombreImg: "" })}
                        placeholder="https://... o adjuntá un archivo"
                        className={inputCls}
                      />
                      <label
                        htmlFor="info-img"
                        className="shrink-0 inline-flex items-center gap-2 bg-white border border-lila-200 text-lila-900 text-xs font-semibold px-4 py-3 rounded-xl cursor-pointer hover:bg-lila-100 transition"
                      >
                        <ImageIcon size={16} /> Adjuntar
                      </label>
                      <input
                        id="info-img"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setNuevoInfo({ ...nuevoInfo, imagen: URL.createObjectURL(f), nombreImg: f.name });
                        }}
                      />
                    </div>
                    {(nuevoInfo.imagen || nuevoInfo.nombreImg) && (
                      <div className="flex items-center gap-3 mt-2">
                        {nuevoInfo.imagen && (
                          <img src={nuevoInfo.imagen} alt="Vista previa" className="w-16 h-16 rounded-xl object-cover border border-lila-100" />
                        )}
                        <span className="text-xs text-stone-500 line-clamp-1">{nuevoInfo.nombreImg || nuevoInfo.imagen}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => {
                        if (!nuevoInfo.titulo.trim()) return;
                        setInfo([{ titulo: nuevoInfo.titulo.trim(), tag: nuevoInfo.tag.trim() || "General" }, ...info]);
                        setNuevoInfo({ titulo: "", tag: "", texto: "", imagen: "", nombreImg: "" });
                        setMostrarFormInfo(false);
                        setPaginaInfo(0);
                      }}
                      className="inline-flex items-center gap-2 bg-lila-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-lila-700 transition"
                    >
                      <Plus size={15} /> Agregar artículo
                    </button>
                    <button
                      onClick={() => { setMostrarFormInfo(false); setNuevoInfo({ titulo: "", tag: "", texto: "", imagen: "", nombreImg: "" }); }}
                      className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-stone-100 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {info.slice(paginaInfo * POR_PAGINA_INFO, paginaInfo * POR_PAGINA_INFO + POR_PAGINA_INFO).map((a, i) => {
                const idx = paginaInfo * POR_PAGINA_INFO + i;
                return (
                  <div key={idx} className="border border-stone-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                    <span className="text-[10px] font-semibold bg-rosa-100 text-lila-900 px-2.5 py-0.5 rounded-full shrink-0">{a.tag || "Sin etiqueta"}</span>
                    <p className="text-sm text-stone-700 flex-1 line-clamp-1">{a.titulo}</p>
                    <button aria-label="Editar" onClick={avisar} className="w-9 h-9 rounded-xl bg-lila-100 text-lila-900 grid place-items-center shrink-0"><Pencil size={15} /></button>
                    <button
                      aria-label="Eliminar"
                      onClick={() => {
                        const resto = info.filter((_, j) => j !== idx);
                        setInfo(resto);
                        if (paginaInfo > 0 && paginaInfo * POR_PAGINA_INFO >= resto.length) setPaginaInfo(paginaInfo - 1);
                      }}
                      className="w-9 h-9 rounded-xl bg-rosa-100 text-lila-900 grid place-items-center shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}

              {Math.ceil(info.length / POR_PAGINA_INFO) > 1 && (
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => setPaginaInfo(Math.max(0, paginaInfo - 1))}
                    disabled={paginaInfo === 0}
                    className="text-xs font-semibold px-4 py-2 rounded-full border border-lila-200 bg-white text-lila-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-lila-50 transition"
                  >
                    ← Anterior
                  </button>
                  <span className="text-[11px] text-stone-500">
                    Página {paginaInfo + 1} de {Math.ceil(info.length / POR_PAGINA_INFO)}
                  </span>
                  <button
                    onClick={() => setPaginaInfo(Math.min(Math.ceil(info.length / POR_PAGINA_INFO) - 1, paginaInfo + 1))}
                    disabled={paginaInfo >= Math.ceil(info.length / POR_PAGINA_INFO) - 1}
                    className="text-xs font-semibold px-4 py-2 rounded-full bg-lila-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-lila-700 transition"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
              <div className="pt-2"><Guardar onClick={avisar} /></div>
            </div>
          )}

          {seccion === "datos" && (
            <div className="mt-6 space-y-5">
              {[["WhatsApp (número)", "whatsapp", "5491100000000"], ["Email", "email", "hola@estefanisalaya.com"], ["Dirección CRyBE", "direccion", "Tucumán 445, General Roca"], ["Instagram (URL)", "instagram", "https://instagram.com/"], ["Horarios", "horarios", "Lun a Vie · 9 a 18 hs"]].map(([label, key, ph]) => (
                <div key={key}><p className={labelCls}>{label}</p><input value={datos[key]} onChange={(e) => setDatos({ ...datos, [key]: e.target.value })} placeholder={ph} className={`${inputCls} mt-2`} /></div>
              ))}
              <Guardar onClick={avisar} />
            </div>
          )}

          {seccion === "agenda" && (
            <div className="mt-6 min-w-0 max-w-full">
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] sm:text-[11px] font-semibold bg-lila-100 text-lila-900 px-3 sm:px-4 py-1.5 rounded-full">HOY · 4 CONFIRMADOS</span>
                <span className="text-[10px] sm:text-[11px] font-semibold bg-rosa-100 text-lila-900 px-3 sm:px-4 py-1.5 rounded-full">9 PENDIENTES POR GESTIONAR</span>
              </div>
              <p className="xl:hidden text-[11px] text-stone-400 mt-3">Deslizá → para ver el resto de los días</p>
              <div className="flex xl:grid xl:grid-cols-5 gap-3 mt-2 xl:mt-4 overflow-x-auto xl:overflow-visible pb-2 xl:pb-0 snap-x snap-mandatory w-full max-w-full min-w-0">
                {Object.entries(AGENDA_DEMO).map(([dia, turnos]) => (
                  <div key={dia} className="min-w-[80%] sm:min-w-[calc(50%-6px)] xl:min-w-0 shrink-0 snap-start border border-stone-200 rounded-2xl overflow-hidden bg-white">
                    <p className="text-[11px] font-bold tracking-[0.15em] text-center text-stone-500 bg-lila-50/60 py-2.5 uppercase">{dia}</p>
                    <div className="p-2 space-y-2">
                      {turnos.map((t, i) => (
                        <div key={i} className={`rounded-xl px-3 py-2 ${t.estado === "pendiente" ? "bg-rosa-100" : "bg-lila-100"}`}>
                          <p className="text-[11px] font-bold text-lila-900">{t.hora} · {t.nombre}</p>
                          <p className="text-[11px] text-stone-500">{t.detalle}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-6">
                <p className={labelCls}>Horarios habilitados</p>
                <button onClick={() => setHorarios(HORARIOS_INICIAL)} className="text-[11px] font-semibold tracking-[0.15em] text-stone-500 hover:text-lila-700">RESTABLECER</button>
              </div>
              <p className="text-xs text-stone-500 mt-1">Tocá un horario para activarlo o desactivarlo (demo visual).</p>
              <div className="space-y-2 mt-3">
                {Object.entries(horarios).map(([dia, horas]) => (
                  <div key={dia} className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold w-7 text-stone-500 uppercase">{dia}</span>
                    {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map((h) => (
                      <button
                        key={h}
                        onClick={() => toggleHorario(dia, h)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full transition ${
                          horas.includes(h) ? "bg-lila-900 text-white" : "bg-stone-100 text-stone-400"
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
