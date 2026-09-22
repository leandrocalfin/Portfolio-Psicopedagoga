import { useEffect, useState } from "react";
import {
  Home,
  User,
  Stethoscope,
  Info,
  CalendarDays,
  Megaphone,
  Settings,
  Save,
  Plus,
  Minus,
  Trash2,
  Pencil,
  Check,
  Image as ImageIcon,
  HelpCircle,
  LogOut,
  ChevronDown,
  Loader2,
  Brain,
  Baby,
  HeartHandshake,
  GraduationCap,
  Users,
  Heart,
  Star,
  BookOpen,
  Lightbulb,
  Puzzle,
  Smile,
  HandHeart,
  Blocks,
  Sparkles,
} from "lucide-react";
import { api } from "./api";
import { useAuth } from "./AuthContext.jsx";
import { useDatos } from "./DataContext.jsx";

const SECCIONES = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "sobre-mi", label: "Sobre mí", icon: User },
  { id: "servicios", label: "Servicios", icon: Stethoscope },
  { id: "informacion", label: "Información", icon: Info },
  { id: "preguntas", label: "Preguntas", icon: HelpCircle },
  { id: "anuncios", label: "Anuncios", icon: Megaphone },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
  { id: "datos", label: "Datos y redes", icon: Settings },
];

const inputCls =
  "w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm outline-none focus:border-lila-500 focus:ring-2 focus:ring-lila-100 bg-white";
const labelCls = "text-[11px] tracking-[0.2em] uppercase text-lila-500 font-semibold";

const SERVICIO_ICONOS = [
  { id: "Brain", Icon: Brain },
  { id: "Baby", Icon: Baby },
  { id: "HeartHandshake", Icon: HeartHandshake },
  { id: "GraduationCap", Icon: GraduationCap },
  { id: "Users", Icon: Users },
  { id: "Heart", Icon: Heart },
  { id: "Star", Icon: Star },
  { id: "BookOpen", Icon: BookOpen },
  { id: "Lightbulb", Icon: Lightbulb },
  { id: "Puzzle", Icon: Puzzle },
  { id: "Smile", Icon: Smile },
  { id: "HandHeart", Icon: HandHeart },
  { id: "Blocks", Icon: Blocks },
  { id: "Sparkles", Icon: Sparkles },
];

function SimpleCaptcha({ onChange }) {
  const [captcha, setCaptcha] = useState({ id: "", svg: "" });
  const [input, setInput] = useState("");
  const cargar = async () => {
    try {
      const res = await fetch("/api/captcha");
      const data = await res.json();
      setCaptcha({ id: data.id, svg: data.svg });
      setInput("");
      onChange("", "");
    } catch {}
  };
  useEffect(() => { cargar(); }, []);
  useEffect(() => { onChange(captcha.id, input); }, [captcha.id, input, onChange]);
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 space-y-2">
      <p className="text-xs font-semibold text-stone-600">Verificación anti-robot</p>
      <div className="flex items-center gap-2">
        <div className="bg-white border border-stone-200 rounded-lg px-1 py-1 overflow-hidden" dangerouslySetInnerHTML={{ __html: captcha.svg }} style={{ width: 120, height: 40 }} />
        <button type="button" onClick={cargar} className="w-8 h-8 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 grid place-items-center" title="Nuevo código">↻</button>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribí el código" className="flex-1 rounded-lg border border-stone-200 px-3 py-1.5 text-sm outline-none focus:border-lila-500" />
      </div>
      <p className="text-[11px] text-stone-400">Escribí el código que ves en la imagen.</p>
    </div>
  );
}

const mensajeError = (err) => {
  const msg = err?.message || "";
  if (!msg || /failed to fetch|networkerror|load failed|fetch failed/i.test(msg)) {
    return "Error de conexión: no se pudo llegar al servidor. Verificá que esté corriendo (npm run dev) y volvé a intentarlo.";
  }
  return msg;
};

function CampoEditable({ label, value, onChange, multiline = false, rows = 4 }) {
  const [editando, setEditando] = useState(false);
  return (
    <div>
      <p className={labelCls}>{label}</p>
      <div className={`flex gap-2 mt-2 ${multiline ? "items-start" : "items-center"}`}>
        {multiline ? (
          <textarea
            rows={rows}
            value={value}
            readOnly={!editando}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputCls} resize-none flex-1 ${editando ? "" : "bg-stone-50 text-stone-500 cursor-not-allowed"}`}
          />
        ) : (
          <input
            value={value}
            readOnly={!editando}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputCls} flex-1 ${editando ? "" : "bg-stone-50 text-stone-500 cursor-not-allowed"}`}
          />
        )}
        <button
          type="button"
          onClick={() => setEditando((v) => !v)}
          className={`shrink-0 inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-2 rounded-xl transition ${editando ? "bg-stone-200 text-stone-700 hover:bg-stone-300" : "bg-lila-100 text-lila-900 hover:bg-lila-200 shadow-[0_2px_10px_rgba(0,0,0,0.25)]"}`}
        >
          <Pencil size={11} /> {editando ? "Hecho" : "Editar"}
        </button>
      </div>
    </div>
  );
}

function Msg({ texto, ok }) {
  if (!texto) return null;
  return (
    <p className={`mt-3 text-xs font-semibold px-4 py-2.5 rounded-xl ${ok ? "bg-emerald-100 text-emerald-900" : "bg-rosa-100 text-lila-900"}`}>
      {texto}
    </p>
  );
}

function Guardar({ onClick, guardando, disabled, exito }) {
  if (exito) {
    return (
      <button disabled className="inline-flex items-center gap-2 bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-full">
        <Check size={15} /> Guardado
      </button>
    );
  }
  const bloqueado = guardando || disabled;
  return (
    <button
      onClick={onClick}
      disabled={bloqueado}
      className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition disabled:opacity-50"
    >
      <Save size={15} /> {guardando ? "Guardando..." : disabled ? "Subiendo imágenes..." : "Guardar Cambios"}
    </button>
  );
}

// Campo reutilizable: subida de imagen con vista previa
function CampoImagen({ value, onChange }) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const elegir = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSubiendo(true);
    setError("");
    try {
      const r = await api.uploadImagen(f);
      if (r.url) onChange(r.url);
      else setError(r.mensaje || "Error al subir imagen");
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  };
  return (
    <div>
      {value && <img src={value} alt="Vista previa" className="mt-1 w-24 h-24 rounded-xl object-cover border border-lila-100" />}
      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
        <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 underline underline-offset-2 hover:text-lila-700 transition cursor-pointer" title="Anexar imagen">
          <ImageIcon size={14} /> {value ? "Cambiar imagen" : "Anexar imagen"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={elegir} />
        </label>
        {value && (
          <button onClick={() => onChange("")} className="text-xs font-semibold text-stone-500 underline underline-offset-2 hover:text-red-600 transition">Quitar</button>
        )}
        {subiendo && <span className="text-xs text-red-600 font-semibold">Subiendo imagen...</span>}
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("estefani@psicopedagoga.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const entrar = async (e) => {
    e?.preventDefault();
    setCargando(true);
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-16 bg-white rounded-[24px] card-shadow p-8">
      <h2 className="font-serif-display text-2xl text-lila-900">Acceso admin</h2>
      <p className="text-sm text-stone-500 mt-1">Ingresá con tu cuenta de psicopedagoga.</p>
      <form onSubmit={entrar} className="mt-6 space-y-4">
        <div><p className={labelCls}>Email</p><input value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputCls} mt-2`} /></div>
        <div><p className={labelCls}>Contraseña</p><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} mt-2`} /></div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button disabled={cargando} className="w-full bg-lila-900 text-white text-xs font-semibold tracking-[0.15em] px-6 py-3 rounded-full hover:bg-lila-700 transition disabled:opacity-50">
          {cargando ? "INGRESANDO..." : "INGRESAR"}
        </button>
      </form>
    </div>
  );
}

function SeccionInicio() {
  const { datos, recargar } = useDatos();
  const [form, setForm] = useState({ titulo: "", descripcion: "", imagenes: [] });
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    if (datos.hero) {
      const h = { titulo: datos.hero.titulo || "", descripcion: datos.hero.descripcion || "", imagenes: datos.hero.imagenes || [] };
      setForm(h);
    }
  }, [datos.hero]);

  const guardar = async () => {
    setGuardando(true);
    setMsg("");
    try {
      await api.updateHero(form);
      recargar("hero");
      setMsg("Inicio guardado ✓");
      setOk(true);
    } catch (e) {
      setMsg(e.message);
      setOk(false);
    } finally {
      setGuardando(false);
    }
  };

  const subirVarias = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const actuales = form.imagenes || [];
    const libres = 5 - actuales.length;
    if (libres <= 0) {
      setMsg("Máximo 5 imágenes. Quitá una para agregar otra.");
      setOk(false);
      e.target.value = "";
      return;
    }
    const aSubir = files.slice(0, libres);
    setSubiendo(true);
    setMsg("");
    try {
      const r = await api.uploadMultiple(aSubir);
      const urls = (r.imagenes || []).map((i) => i.url).filter(Boolean);
      if (!urls.length) throw new Error(r.mensaje || "Error al subir");
      const nuevas = [...actuales, ...urls].slice(0, 5);
      setForm((f) => ({ ...f, imagenes: nuevas }));
      setMsg(files.length > libres ? `Solo quedaban ${libres} lugar(es). Se subieron ${urls.length}. Recordá pulsar Guardar ✓` : `${urls.length} imagen(es) subida(s). Recordá pulsar Guardar ✓`);
      setOk(true);
    } catch (err) {
      setMsg(mensajeError(err));
      setOk(false);
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  };

  const quitar = (i) => {
    setForm((f) => ({ ...f, imagenes: (f.imagenes || []).filter((_, j) => j !== i) }));
    setMsg("Imagen quitada. Recordá pulsar Guardar ✓");
    setOk(true);
  };

  return (
    <div className="mt-4 space-y-4">
      <CampoEditable label="Título principal" value={form.titulo} onChange={(v) => setForm({ ...form, titulo: v })} multiline rows={2} />
      <CampoEditable label="Descripción" value={form.descripcion} onChange={(v) => setForm({ ...form, descripcion: v })} multiline rows={2} />
      <div>
        <p className={labelCls}>Imágenes ({(form.imagenes || []).length}/5)</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {(form.imagenes || []).map((img, i) => (
            <div key={i} className="relative w-20 h-20">
              <img src={img} alt={`Hero ${i + 1}`} className="w-20 h-20 rounded-xl object-cover border border-lila-100" />
              <button onClick={() => quitar(i)} aria-label="Quitar" className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rosa-100 text-lila-900 grid place-items-center text-xs font-bold">×</button>
            </div>
          ))}
          {Array.from({ length: 5 - (form.imagenes || []).length }).map((_, idx) =>
            idx === 0 ? (
              <label key={`add-${idx}`} className="w-20 h-20 rounded-xl border-2 border-dashed border-lila-200 text-lila-700 grid place-items-center cursor-pointer hover:bg-lila-50 transition" title="Subir imagen">
                {subiendo ? <span className="text-[10px] font-semibold">...</span> : <Plus size={22} />}
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={subirVarias} />
              </label>
            ) : (
              <div key={`empty-${idx}`} className="w-20 h-20 rounded-xl border-2 border-dashed border-lila-200 bg-stone-50/30 grid place-items-center text-lila-700">
                <Plus size={22} />
              </div>
            )
          )}
        </div>
        {subiendo && <p className="text-xs text-red-600 mt-1 font-semibold">Subiendo imagen...</p>}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Guardar onClick={guardar} guardando={guardando} disabled={subiendo} />
        <button
          onClick={() => {
            const h = datos.hero || {};
            setForm({ titulo: h.titulo || "", descripcion: h.descripcion || "", imagenes: h.imagenes || [] });
            setMsg("");
            setOk(false);
          }}
          className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition bg-white"
        >
          Cancelar
        </button>
      </div>
      <Msg texto={msg} ok={ok} />
    </div>
  );
}

function SeccionSobreMi() {
  const { datos, recargar } = useDatos();
  const [form, setForm] = useState({ titulo: "", descripcion: "", imagen: "" });
  const [certs, setCerts] = useState([]);
  const [items, setItems] = useState([]);
  const [mostrarLibro, setMostrarLibro] = useState(true);
  const [libroLink, setLibroLink] = useState("");
  const [nuevo, setNuevo] = useState({ titulo: "", organizacion: "", año: "", imagen: "" });
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [certAbierto, setCertAbierto] = useState(null);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [exitoGuardar, setExitoGuardar] = useState(false);
  const [imagenNueva, setImagenNueva] = useState(false);
  const [certExito, setCertExito] = useState(null);
  const [nuevoExito, setNuevoExito] = useState(false);
  const [nuevoError, setNuevoError] = useState("");
  const [itemsHecho, setItemsHecho] = useState({});

  useEffect(() => {
    if (datos.sobreMi) {
      setForm({ titulo: datos.sobreMi.titulo || "", descripcion: datos.sobreMi.descripcion || "", imagen: datos.sobreMi.imagen || "" });
      setCerts(datos.sobreMi.certificados || []);
      setMostrarLibro(datos.sobreMi.mostrarLibro !== false);
      const dbItems = datos.sobreMi.items || [];
      const libroItem = dbItems.find((it) => /libro/i.test(it?.texto || ""));
      setLibroLink(libroItem?.link);
      const editable = dbItems.filter((it) => !/libro/i.test(it?.texto || "")).slice(0, 6);
      setItems(editable);
    }
  }, [datos.sobreMi]);

  const itemsParaGuardar = () => {
    const base = items
      .filter((it) => it.texto && it.texto.trim())
      .map((it, i) => ({ texto: it.texto.trim(), link: it.link?.trim() || undefined, orden: i + 1 }));
    if (mostrarLibro) base.push({ texto: "Autora del libro «¿Y por qué no a mí?»", link: libroLink?.trim() || undefined, orden: base.length + 1 });
    return base.slice(0, 7);
  };

  const guardarDatos = async () => {
    setGuardando(true);
    setMsg("");
    try {
      await api.updateSobreMi({ ...form, items: itemsParaGuardar(), certificados: certs, mostrarLibro });
      recargar("sobreMi");
      setMsg("Datos de Sobre mí guardados ✓");
      setOk(true);
      setImagenNueva(false);
      setItemsHecho({});
      setExitoGuardar(true);
      setTimeout(() => setExitoGuardar(false), 2500);
    } catch (e) {
      setMsg(e.message);
      setOk(false);
    } finally {
      setGuardando(false);
    }
  };

  const agregarCert = async () => {
    if (!nuevo.titulo.trim() || !nuevo.organizacion.trim()) { setNuevoError("Título e institución del certificado requeridos"); return; }
    const item = { titulo: nuevo.titulo.trim(), organizacion: nuevo.organizacion.trim(), año: Number(nuevo.año) || undefined, imagen: nuevo.imagen || "" };
    const nuevas = [item, ...certs];
    setGuardando(true);
    setNuevoError("");
    setMsg("");
    try {
      await api.updateSobreMi({ ...form, items: itemsParaGuardar(), certificados: nuevas, mostrarLibro });
      setCerts(nuevas);
      setCertAbierto((abierto) => (abierto === null ? null : abierto + 1));
      recargar("sobreMi");
      setNuevoExito(true);
      setTimeout(() => {
        setNuevoExito(false);
        setNuevo({ titulo: "", organizacion: "", año: "", imagen: "" });
        setMostrarNuevo(false);
      }, 1800);
      setMsg("Certificado guardado ✓");
      setOk(true);
    } catch (e) {
      setNuevoError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  const quitarCert = async (i) => {
    const nuevas = certs.filter((_, j) => j !== i);
    setCerts(nuevas);
    setCertAbierto(null);
    setGuardando(true);
    try {
      await api.updateSobreMi({ ...form, items: itemsParaGuardar(), certificados: nuevas, mostrarLibro });
      recargar("sobreMi");
    } catch (e) {
      setCerts(certs);
      window.alert(e.message || "Error al eliminar certificado");
    } finally {
      setGuardando(false);
    }
  };

  const confirmarQuitarCert = (i) => {
    const c = certs[i];
    const nombre = c?.titulo ? `"${c.titulo}"` : `certificado ${i + 1}`;
    if (!window.confirm(`¿Estás seguro de que deseas eliminar ${nombre}? Esta acción no se puede deshacer.`)) return;
    quitarCert(i);
  };

  const guardarCert = async (i) => {
    const c = certs[i];
    if (!(c.titulo || "").trim() || !(c.organizacion || "").trim()) {
      setMsg("Completá título e institución del certificado");
      setOk(false);
      return;
    }
    setGuardando(true);
    setMsg("");
    try {
      await api.updateSobreMi({ ...form, items: itemsParaGuardar(), certificados: certs, mostrarLibro });
      recargar("sobreMi");
      setCertExito(i);
      setTimeout(() => setCertExito((actual) => (actual === i ? null : actual)), 2500);
    } catch (e) {
      setMsg(e.message);
      setOk(false);
    } finally {
      setGuardando(false);
    }
  };

  const cancelarCert = (i) => {
    const original = (datos.sobreMi?.certificados || [])[i];
    setCerts((certs) => certs.map((x, j) => (j === i ? { ...original } : x)));
    setCertAbierto(null);
    setMsg("");
    setOk(false);
  };

  return (
    <div className="mt-6 space-y-5">
      <CampoEditable label="Título" value={form.titulo} onChange={(v) => setForm({ ...form, titulo: v })} />
      <CampoEditable label="Descripción" value={form.descripcion} onChange={(v) => setForm({ ...form, descripcion: v })} multiline rows={5} />
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <p className={labelCls}>Foto</p>
          <div className="mt-1">
            <CampoImagen value={form.imagen} onChange={(v) => { setForm({ ...form, imagen: v }); setImagenNueva(true); setExitoGuardar(false); }} />
          </div>
        </div>
        <div>
          <p className={labelCls}>Libro</p>
          <label className="flex items-center gap-2 cursor-pointer select-none bg-white border border-stone-200 rounded-xl px-3 py-2 mt-1">
            <input type="checkbox" checked={mostrarLibro} onChange={(e) => setMostrarLibro(e.target.checked)} className="w-4 h-4 rounded border-stone-300 text-lila-600 focus:ring-lila-500" />
            <span className="text-sm text-stone-700">Mostrar libro en Sobre mí</span>
          </label>
          <p className="text-[11px] text-stone-400 mt-1">Imagen /libro.png y galería /libro1..10.png</p>
        </div>
      </div>
      <div className="pt-2">
        <div className="flex items-center justify-between gap-3">
          <p className={labelCls}>Ítems ({items.length + (mostrarLibro ? 1 : 0)}/7)</p>
          <button
            onClick={() => setItems([...items, { texto: "", orden: items.length + 1 }])}
            disabled={items.length >= 6}
            className={`shrink-0 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition ${items.length >= 6 ? "bg-stone-200 text-stone-500 cursor-not-allowed" : "bg-lila-900 text-white hover:bg-lila-700"}`}
            title={items.length >= 6 ? "Máximo 6 ítems alcanzado" : "Agregar ítem"}
          >
            <Plus size={14} /> Nuevo ítem
          </button>
        </div>
        {items.length >= 6 && <p className="text-xs text-amber-700 mt-2">Máximo alcanzado (6 ítems + libro fijo = 7). Para agregar uno nuevo, eliminá uno.</p>}
        <p className="text-[11px] text-stone-400 mt-1">Máximo 6 ítems editables. El libro es fijo y aparece al final cuando está activado.</p>
        <div className="mt-2 space-y-1.5">
          {items.map((it, i) => (
            <div key={i} className={`flex gap-2 items-center py-1 ${itemsHecho[i] ? "bg-emerald-50/40 rounded-lg px-1" : ""}`}>
              <span className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold shrink-0 ${itemsHecho[i] ? "bg-emerald-500 text-white" : "bg-lila-100 text-lila-700"}`}>{itemsHecho[i] ? <Check size={12} /> : i + 1}</span>
              <input
                value={it.texto}
                onChange={(e) => {
                  setItems(items.map((x, j) => (j === i ? { ...x, texto: e.target.value } : x)));
                  setItemsHecho((prev) => { const n = { ...prev }; delete n[i]; return n; });
                }}
                placeholder="Texto del ítem"
                className={`${inputCls} flex-1 ${itemsHecho[i] ? "bg-emerald-50/50" : ""}`}
              />
              <button
                onClick={() => {
                  if (!it.texto.trim()) return;
                  setItemsHecho((prev) => ({ ...prev, [i]: true }));
                  setTimeout(() => setItemsHecho((prev) => { const n = { ...prev }; delete n[i]; return n; }), 1800);
                }}
                aria-label="Confirmar ítem"
                className={`w-8 h-8 rounded-full grid place-items-center shrink-0 transition ${itemsHecho[i] ? "bg-emerald-500 text-white" : "bg-lila-100 text-lila-900 hover:bg-lila-200"}`}
                title="Confirmar"
              >
                <Check size={14} />
              </button>
              <button onClick={() => { const txt = it.texto?.trim() ? `"${it.texto.trim()}"` : `ítem ${i + 1}`; if (!window.confirm(`¿Estás seguro de que deseas eliminar ${txt}? Luego debés pulsar Guardar para confirmar el cambio.`)) return; setItems(items.filter((_, j) => j !== i)); }} aria-label="Eliminar ítem" className="w-8 h-8 rounded-full bg-rosa-100 text-lila-900 grid place-items-center shrink-0 hover:bg-rosa-200 transition"><Trash2 size={14} /></button>
            </div>
          ))}
          {!items.length && <p className="text-xs text-stone-400">Sin ítems. Agregá uno con Nuevo ítem.</p>}
          {mostrarLibro && (
            <div className="border border-lila-200 rounded-xl p-2 bg-lila-50/40">
              <div className="flex gap-2 items-center">
                <span className="w-7 h-7 rounded-full bg-lila-900 text-white grid place-items-center text-xs font-bold shrink-0">{items.length + 1}</span>
                <span className="text-sm text-stone-700 flex-1">Autora del libro «¿Y por qué no a mí?» <span className="text-xs text-lila-600">(fijo - al final)</span></span>
                <span className="text-xs font-semibold text-lila-700 bg-lila-100 px-2 py-1 rounded-full">Libro</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Se muestra/oculta con “Mostrar libro” arriba.</p>
            </div>
          )}
        </div>
      </div>
      <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
        <Guardar onClick={guardarDatos} guardando={guardando} exito={exitoGuardar} />
        <button
          onClick={() => {
            const orig = datos.sobreMi || {};
            setForm({ titulo: orig.titulo || "", descripcion: orig.descripcion || "", imagen: orig.imagen || "" });
            const dbItems = orig.items || [];
            const libroIt = dbItems.find((it) => /libro/i.test(it?.texto || ""));
            setLibroLink(libroIt?.link);
            setItems(dbItems.filter((it) => !/libro/i.test(it?.texto || "")));
            setCerts(orig.certificados || []);
            setMostrarLibro(orig.mostrarLibro !== false);
            setItemsHecho({});
            setImagenNueva(false);
            setExitoGuardar(false);
            setMsg("");
            setOk(false);
          }}
          className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition bg-white"
        >
          Cancelar
        </button>
      </div>
      {imagenNueva && !exitoGuardar && <p className="text-xs font-semibold text-emerald-700 text-center">Recuerda apretar Guardar para confirmar los cambios ✓</p>}
      {(() => {
        const origItems = (datos.sobreMi?.items || []).filter((it) => !/libro/i.test(it?.texto || ""));
        const origLibroLink = (datos.sobreMi?.items || []).find((it) => /libro/i.test(it?.texto || ""))?.link;
        const origMostrar = datos.sobreMi?.mostrarLibro !== false;
        const itemsDirty = JSON.stringify(items) !== JSON.stringify(origItems);
        const libroDirty = mostrarLibro !== origMostrar || (libroLink || undefined) !== (origLibroLink || undefined);
        if ((itemsDirty || libroDirty) && !exitoGuardar) return <p className="text-xs font-semibold text-amber-700 text-center">Recuerda apretar Guardar para confirmar el cambio ✓</p>;
        return null;
      })()}
      <div className="pt-4"><hr className="border-t border-lila-200" /></div>
      <div className="pt-2">
        <div className="flex items-center justify-between gap-3">
          <p className="font-serif-display text-2xl text-lila-900">Certificados ({certs.length})</p>
          <button
            onClick={() => { setMostrarNuevo(!mostrarNuevo); setNuevoError(""); }}
            className="shrink-0 inline-flex items-center gap-2 bg-lila-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-lila-700 transition"
          >
            {mostrarNuevo ? <Minus size={15} /> : <Plus size={15} />} {mostrarNuevo ? "Cerrar" : "Nuevo Certificado"}
          </button>
        </div>
        {mostrarNuevo && (
        <div className="mt-4 rounded-2xl border-2 border-lila-500 bg-lila-50/60 p-4 shadow space-y-3">
          <p className="text-sm font-bold text-lila-900">Nuevo certificado</p>
          <div><p className={labelCls}>Título</p><input value={nuevo.titulo} onChange={(e) => { setNuevo({ ...nuevo, titulo: e.target.value }); if (nuevoError) setNuevoError(""); }} className={`${inputCls} mt-1.5`} /></div>
          <div className="grid sm:grid-cols-[1fr_7rem] gap-3 items-end">
            <div><p className={labelCls}>Institución</p><input value={nuevo.organizacion} onChange={(e) => { setNuevo({ ...nuevo, organizacion: e.target.value }); if (nuevoError) setNuevoError(""); }} className={`${inputCls} mt-1.5`} /></div>
            <div><p className={labelCls}>Año</p><input type="number" value={nuevo.año} onChange={(e) => setNuevo({ ...nuevo, año: e.target.value })} className={`${inputCls} mt-1.5 w-full`} /></div>
          </div>
          <div><p className={labelCls}>Imagen del certificado</p><CampoImagen value={nuevo.imagen} onChange={(v) => setNuevo({ ...nuevo, imagen: v })} /></div>
          <div className="flex items-center gap-3 flex-wrap">
            {nuevoExito ? (
              <button disabled className="inline-flex items-center gap-2 bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-full"><Check size={15} /> Guardado</button>
            ) : (
              <>
                <button onClick={agregarCert} disabled={guardando} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition disabled:opacity-50">
                  {guardando ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} {guardando ? "Guardando..." : "Guardar"}
                </button>
                <button
                  onClick={() => { setNuevo({ titulo: "", organizacion: "", año: "", imagen: "" }); setNuevoError(""); setMostrarNuevo(false); }}
                  className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition bg-white"
                >
                  Cancelar
                </button>
              </>
            )}
            {nuevoError && <span className="text-xs font-semibold text-red-600">{nuevoError}</span>}
          </div>
        </div>
        )}
        <div className="mt-5 space-y-3">
          {certs.map((c, i) => {
            const abierto = certAbierto === i;
            return (
              <div key={c._id || i} className={`rounded-2xl border-2 transition overflow-hidden ${abierto ? "border-lila-500 shadow" : "border-stone-200 hover:border-lila-200"}`}>
                <div className={`flex items-center gap-3 px-4 py-3 ${abierto ? "bg-lila-900" : "bg-white"}`}>
                  <span className={`w-10 h-10 rounded-full grid place-items-center text-sm font-bold shrink-0 ${abierto ? "bg-white/15 text-white" : "bg-lila-100 text-lila-700"}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${abierto ? "text-white" : "text-stone-500"}`}>{c.titulo || `Certificado ${i + 1}`}</p>
                    <p className={`text-xs truncate ${abierto ? "text-white/70" : "text-stone-500"}`}>{c.organizacion || "Sin institución"}</p>
                  </div>
                  <button
                    onClick={() => setCertAbierto(abierto ? null : i)}
                    aria-expanded={abierto}
                    className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition ${abierto ? "bg-white text-lila-900" : "bg-lila-100 text-lila-900 hover:bg-lila-200 shadow-[0_2px_10px_rgba(0,0,0,0.25)]"}`}
                  >
                    <ChevronDown size={14} className={`transition ${abierto ? "rotate-180" : ""}`} /> {abierto ? "Cerrar" : "Editar"}
                  </button>
                  <button onClick={() => confirmarQuitarCert(i)} aria-label="Eliminar certificado" className={`w-9 h-9 rounded-full grid place-items-center shrink-0 transition ${abierto ? "bg-white/10 text-white hover:bg-white/20" : "bg-rosa-100 text-lila-900 hover:bg-rosa-200"}`}><Trash2 size={15} /></button>
                </div>
                {abierto && (
                <div className="px-4 pb-5 pt-4 space-y-4 bg-lila-50/60">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2"><p className={labelCls}>Título</p><input value={c.titulo || ""} onChange={(e) => setCerts(certs.map((x, j) => (j === i ? { ...x, titulo: e.target.value } : x)))} className={`${inputCls} mt-1.5`} /></div>
                    <div><p className={labelCls}>Institución</p><input value={c.organizacion || ""} onChange={(e) => setCerts(certs.map((x, j) => (j === i ? { ...x, organizacion: e.target.value } : x)))} className={`${inputCls} mt-1.5`} /></div>
                    <div><p className={labelCls}>Año</p><input type="number" value={c.año ?? ""} onChange={(e) => setCerts(certs.map((x, j) => (j === i ? { ...x, año: e.target.value } : x)))} className={`${inputCls} mt-1.5`} /></div>
                    <div className="sm:col-span-2"><p className={labelCls}>Imagen del certificado</p><CampoImagen value={c.imagen || ""} onChange={(v) => setCerts(certs.map((x, j) => (j === i ? { ...x, imagen: v } : x)))} /></div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {certExito === i ? (
                    <button disabled className="inline-flex items-center gap-2 bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-full"><Check size={15} /> Guardado</button>
                    ) : (
                    <button onClick={() => guardarCert(i)} disabled={guardando} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition disabled:opacity-50">
                      {guardando ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} {guardando ? "Guardando..." : "Guardar"}
                    </button>
                    )}
                    <button onClick={() => cancelarCert(i)} className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition bg-white">Cancelar</button>
                  </div>
                </div>
                )}
              </div>
            );
          })}
          {!certs.length && <p className="text-xs text-stone-400">Sin certificados. Agregá el primero con Nuevo Certificado.</p>}
        </div>
      </div>
    </div>
  );
}

function SeccionServicios() {
  const { datos, recargar } = useDatos();
  const [lista, setLista] = useState([]);
  const [nuevo, setNuevo] = useState({ titulo: "", descripcion: "", icono: "", orden: 0 });
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    setLista(datos.servicios || []);
  }, [datos.servicios]);

  const crear = async () => {
    if (!nuevo.titulo.trim() || !nuevo.descripcion.trim()) { setMsg("Título y descripción requeridos"); setOk(false); return; }
    try {
      const creado = await api.createServicio({ ...nuevo, orden: Number(nuevo.orden) || 0 });
      setLista((l) => [creado, ...l]);
      setNuevo({ titulo: "", descripcion: "", icono: "", orden: 0 });
      setMostrarNuevo(false);
      recargar("servicios");
      setMsg("Servicio creado ✓");
      setOk(true);
    } catch (e) { setMsg(e.message); setOk(false); }
  };
  const guardarItem = async (s) => {
    if (!s.titulo.trim() || !s.descripcion.trim()) { setMsg("Título y descripción requeridos"); setOk(false); return; }
    try {
      await api.updateServicio(s._id, { titulo: s.titulo.trim(), descripcion: s.descripcion.trim(), icono: s.icono, orden: Number(s.orden) || 0, activo: s.activo });
      recargar("servicios");
      setMsg("Servicio guardado ✓");
      setOk(true);
      setExpandido(null);
    } catch (e) { setMsg(e.message); setOk(false); }
  };
  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este servicio?")) return;
    try {
      await api.deleteServicio(id);
      setLista((l) => l.filter((x) => x._id !== id));
      recargar("servicios");
      setMsg("Servicio eliminado ✓");
      setOk(true);
    } catch (e) { setMsg(e.message); setOk(false); }
  };

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-stone-500">{lista.length} servicios</p>
        <button
          onClick={() => setMostrarNuevo(!mostrarNuevo)}
          className="inline-flex items-center gap-2 bg-lila-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-lila-700 transition"
        >
          {mostrarNuevo ? <Minus size={15} /> : <Plus size={15} />} {mostrarNuevo ? "Cerrar" : "Agregar servicio"}
        </button>
      </div>
      {mostrarNuevo && (
        <div className="rounded-2xl border-2 border-lila-500 bg-lila-50/60 p-4 shadow space-y-3">
          <p className="text-sm font-bold text-lila-900">Nuevo servicio</p>
          <div><p className={labelCls}>Título</p><input value={nuevo.titulo} onChange={(e) => setNuevo({ ...nuevo, titulo: e.target.value })} placeholder="Título" className={`${inputCls} mt-1.5`} /></div>
          <div><p className={labelCls}>Descripción</p><input value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} placeholder="Descripción" className={`${inputCls} mt-1.5`} /></div>
        <div>
          <p className={labelCls}>Icono</p>
          <div className="grid grid-cols-7 sm:grid-cols-8 gap-2 mt-1.5">
            {SERVICIO_ICONOS.map(({ id, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setNuevo({ ...nuevo, icono: id })}
                title={id}
                className={`w-9 h-9 rounded-xl grid place-items-center border-2 transition ${nuevo.icono === id ? "bg-lila-900 text-white border-lila-900 shadow" : "bg-white text-stone-600 border-stone-200 hover:border-lila-300 hover:bg-lila-50"}`}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
          {nuevo.icono && <p className="text-[11px] text-stone-500 mt-1">Seleccionado: {nuevo.icono}</p>}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={crear} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition"><Save size={15} /> Guardar</button>
          <button onClick={() => { setNuevo({ titulo: "", descripcion: "", icono: "", orden: 0 }); setMostrarNuevo(false); }} className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition bg-white">Cancelar</button>
        </div>
      </div>
      )}
      {lista.map((s, idx) => {
        const abierto = expandido === s._id;
        return (
          <div key={s._id} className={`rounded-2xl border-2 overflow-hidden transition ${abierto ? "border-lila-500 shadow bg-lila-50/60" : "border-stone-200 hover:border-lila-200 bg-white"}`}>
            <div className={`flex items-center gap-3 px-4 py-3 ${abierto ? "bg-lila-50/60" : "bg-white"}`}>
              <span className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold shrink-0 ${abierto ? "bg-lila-900 text-white" : "bg-lila-100 text-lila-700"}`}>
                {(() => {
                  const found = SERVICIO_ICONOS.find((v) => v.id === s.icono);
                  if (found) {
                    const Icon = found.Icon;
                    return <Icon size={16} />;
                  }
                  return idx + 1;
                })()}
              </span>
              <p className="text-sm text-stone-700 flex-1 truncate">{s.titulo || `Servicio ${idx + 1}`}</p>
              <button onClick={() => setExpandido(abierto ? null : s._id)} className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition ${abierto ? "bg-white text-lila-900 border border-stone-200" : "bg-lila-100 text-lila-900 hover:bg-lila-200"}`}>{abierto ? "Cerrar" : "Editar"}</button>
              <button onClick={() => eliminar(s._id)} aria-label="Eliminar" className="w-9 h-9 rounded-full bg-rosa-100 text-lila-900 grid place-items-center shrink-0 hover:bg-rosa-200 transition"><Trash2 size={15} /></button>
            </div>
            {abierto && (
              <div className="px-4 pb-4 pt-3 space-y-3 bg-white">
                <div><p className={labelCls}>Título</p><input value={s.titulo} onChange={(e) => setLista(lista.map((x) => (x._id === s._id ? { ...x, titulo: e.target.value } : x)))} className={`${inputCls} mt-1.5`} /></div>
                <div><p className={labelCls}>Descripción</p><input value={s.descripcion} onChange={(e) => setLista(lista.map((x) => (x._id === s._id ? { ...x, descripcion: e.target.value } : x)))} className={`${inputCls} mt-1.5`} /></div>
                <div>
                  <p className={labelCls}>Icono</p>
                  <div className="grid grid-cols-7 sm:grid-cols-8 gap-2 mt-1.5">
                    {SERVICIO_ICONOS.map(({ id, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setLista(lista.map((x) => (x._id === s._id ? { ...x, icono: id } : x)))}
                        title={id}
                        className={`w-9 h-9 rounded-xl grid place-items-center border-2 transition ${s.icono === id ? "bg-lila-900 text-white border-lila-900 shadow" : "bg-white text-stone-600 border-stone-200 hover:border-lila-300 hover:bg-lila-50"}`}
                      >
                        <Icon size={16} />
                      </button>
                    ))}
                  </div>
                  {s.icono && <p className="text-[11px] text-stone-500 mt-1">Seleccionado: {s.icono}</p>}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => guardarItem(s)} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition"><Save size={15} /> Guardar</button>
                  <button onClick={() => setExpandido(null)} className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition bg-white">Cancelar</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <Msg texto={msg} ok={ok} />
    </div>
  );
}

function SeccionInformacion() {
  const { datos, recargar } = useDatos();
  const [lista, setLista] = useState([]);
  const [editId, setEditId] = useState(null);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [visibles, setVisibles] = useState(10);
  const [form, setForm] = useState({ titulo: "", descripcion: "", imagen: "" });
  const [msg, setMsg] = useState("");
  const VACIO = { titulo: "", descripcion: "", imagen: "" };

  useEffect(() => {
    setLista(datos.articulos || []);
  }, [datos.articulos]);

  const payload = (f) => ({
    titulo: f.titulo.trim(),
    descripcion: f.descripcion.trim(),
    imagen: f.imagen || "",
    tag: "General",
    cuerpo: [],
  });

  const crear = async () => {
    if (!form.titulo.trim() || !form.descripcion.trim()) { setMsg("Título y descripción requeridos"); return; }
    try {
      const creado = await api.createArticulo(payload(form));
      setLista((l) => [creado, ...l]);
      recargar("articulos");
      setForm(VACIO);
      setMostrarCrear(false);
      setMsg("");
    } catch (e) { setMsg(e.message); }
  };

  const guardar = async () => {
    if (!form.titulo.trim() || !form.descripcion.trim()) { setMsg("Título y descripción requeridos"); return; }
    try {
      const act = await api.updateArticulo(editId, payload(form));
      setLista((l) => l.map((x) => (x._id === editId ? act : x)));
      recargar("articulos");
      setEditId(null);
      setForm(VACIO);
      setMsg("");
    } catch (e) { setMsg(e.message); }
  };

  const empezarEditar = (a) => {
    setMostrarCrear(false);
    setEditId(a._id);
    setForm({ titulo: a.titulo || "", descripcion: a.descripcion || "", imagen: a.imagen || "" });
    setMsg("");
  };

  const cancelar = () => {
    setEditId(null);
    setMostrarCrear(false);
    setForm(VACIO);
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este artículo?")) return;
    try {
      await api.deleteArticulo(id);
      setLista((l) => l.filter((x) => x._id !== id));
      recargar("articulos");
    } catch (e) { setMsg(e.message); }
  };

  const campos = (
    <>
      <div><p className={labelCls}>Título</p><input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Título" className={`${inputCls} mt-1.5`} /></div>
      <div><p className={labelCls}>Descripción</p><textarea rows={5} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción" className={`${inputCls} mt-1.5 resize-none`} /></div>
      <div><p className={labelCls}>Imagen</p><CampoImagen value={form.imagen} onChange={(v) => setForm({ ...form, imagen: v })} /></div>
    </>
  );

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-stone-500">{lista.length} artículos</p>
        <button
          onClick={() => { cancelar(); setMostrarCrear(!mostrarCrear); }}
          className="inline-flex items-center gap-2 bg-lila-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-lila-700 transition"
        >
          {mostrarCrear ? <Minus size={15} /> : <Plus size={15} />} {mostrarCrear ? "Cerrar" : "Agregar nuevo artículo"}
        </button>
      </div>

      {mostrarCrear && (
        <div className="rounded-2xl border-2 border-lila-500 bg-lila-50/60 p-4 shadow space-y-3">
          <p className="text-sm font-bold text-lila-900">Nuevo artículo</p>
          {campos}
          <div className="flex gap-2 flex-wrap">
            <button onClick={crear} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition"><Save size={15} /> Guardar</button>
            <button onClick={cancelar} className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition bg-white">Cancelar</button>
          </div>
        </div>
      )}

      {lista.slice(0, visibles).map((a, idx) => {
        const abierto = editId === a._id;
        return (
          <div key={a._id} className={`rounded-2xl border-2 overflow-hidden transition ${abierto ? "border-lila-500 shadow bg-lila-50/60" : "border-stone-200 hover:border-lila-200 bg-white"}`}>
            <div className={`flex items-center gap-3 px-4 py-3 ${abierto ? "bg-lila-50/60" : "bg-white"}`}>
              <span className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold shrink-0 ${abierto ? "bg-lila-900 text-white" : "bg-lila-100 text-lila-700"}`}>{idx + 1}</span>
              {a.imagen && <img src={a.imagen} alt="" className="w-8 h-8 rounded-xl object-cover shrink-0" />}
              <p className="text-sm text-stone-700 flex-1 truncate">{a.titulo}</p>
              <button onClick={() => (abierto ? cancelar() : empezarEditar(a))} className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition ${abierto ? "bg-white text-lila-900 border border-stone-200" : "bg-lila-100 text-lila-900 hover:bg-lila-200"}`}>{abierto ? "Cerrar" : "Editar"}</button>
              <button onClick={() => eliminar(a._id)} aria-label="Eliminar" className="w-9 h-9 rounded-full bg-rosa-100 text-lila-900 grid place-items-center shrink-0 hover:bg-rosa-200 transition"><Trash2 size={15} /></button>
            </div>
            {abierto && (
              <div className="px-4 pb-4 pt-3 space-y-3 bg-white">
                {campos}
                <div className="flex gap-2 flex-wrap">
                  <button onClick={guardar} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition"><Save size={15} /> Guardar</button>
                  <button onClick={cancelar} className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition bg-white">Cancelar</button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {visibles < lista.length && (
        <button onClick={() => setVisibles((v) => v + 10)} className="w-full text-xs font-semibold text-lila-700 border border-lila-200 rounded-full px-5 py-2.5 hover:bg-lila-50 transition">
          Ver más ({lista.length - visibles} restantes)
        </button>
      )}
      <Msg texto={msg} ok={false} />
    </div>
  );
}

function SeccionPreguntas() {
  const { datos, recargar } = useDatos();
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState({ pregunta: "", respuesta: "", orden: 0 });
  const [edit, setEdit] = useState(null);
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setLista(datos.faqs || []);
  }, [datos.faqs]);

  const guardar = async () => {
    if (!form.pregunta.trim() || !form.respuesta.trim()) { setMsg("Pregunta y respuesta requeridas"); setOk(false); return; }
    try {
      const body = { pregunta: form.pregunta.trim(), respuesta: form.respuesta.trim(), orden: Number(form.orden) || 0 };
      if (edit) {
        const act = await api.updateFAQ(edit, body);
        setLista((l) => l.map((x) => (x._id === edit ? act : x)));
        setMsg("Pregunta guardada ✓");
      } else {
        const creado = await api.createFAQ(body);
        setLista((l) => [creado, ...l]);
        setMsg("Pregunta creada ✓");
      }
      setOk(true);
      recargar("faqs");
      setForm({ pregunta: "", respuesta: "", orden: 0 });
      setEdit(null);
      setMostrarNuevo(false);
    } catch (e) { setMsg(e.message); setOk(false); }
  };
  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta pregunta?")) return;
    try {
      await api.deleteFAQ(id);
      setLista((l) => l.filter((x) => x._id !== id));
      recargar("faqs");
      setMsg("Pregunta eliminada ✓");
      setOk(true);
    } catch (e) { setMsg(e.message); setOk(false); }
  };

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-stone-500">{lista.length} preguntas</p>
        <button
          onClick={() => {
            setEdit(null);
            setForm({ pregunta: "", respuesta: "", orden: 0 });
            setMostrarNuevo(!mostrarNuevo);
          }}
          className="inline-flex items-center gap-2 bg-lila-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-lila-700 transition"
        >
          {mostrarNuevo ? <Minus size={15} /> : <Plus size={15} />} {mostrarNuevo ? "Cerrar" : "Agregar pregunta"}
        </button>
      </div>
      {mostrarNuevo && (
        <div className="rounded-2xl border-2 border-lila-500 bg-lila-50/60 p-4 shadow space-y-3">
          <p className="text-sm font-bold text-lila-900">Nueva pregunta</p>
          <div><p className={labelCls}>Pregunta</p><input value={form.pregunta} onChange={(e) => setForm({ ...form, pregunta: e.target.value })} placeholder="Pregunta" className={`${inputCls} mt-1.5`} /></div>
          <div><p className={labelCls}>Respuesta</p><textarea rows={3} value={form.respuesta} onChange={(e) => setForm({ ...form, respuesta: e.target.value })} placeholder="Respuesta" className={`${inputCls} mt-1.5 resize-none`} /></div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={guardar} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition"><Save size={15} /> Guardar</button>
            <button onClick={() => setMostrarNuevo(false)} className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition bg-white">Cancelar</button>
          </div>
        </div>
      )}
      {lista.map((f, idx) => {
        const abierto = edit === f._id;
        return (
          <div key={f._id} className={`rounded-2xl border-2 overflow-hidden transition ${abierto ? "border-lila-500 shadow bg-lila-50/60" : "border-stone-200 hover:border-lila-200 bg-white"}`}>
            <div className={`flex items-center gap-3 px-4 py-3 ${abierto ? "bg-lila-50/60" : "bg-white"}`}>
              <span className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold shrink-0 ${abierto ? "bg-lila-900 text-white" : "bg-lila-100 text-lila-700"}`}>{idx + 1}</span>
              <p className="text-sm text-stone-700 flex-1 truncate">{f.pregunta}</p>
              <button
                onClick={() => {
                  if (abierto) {
                    setEdit(null);
                    setForm({ pregunta: "", respuesta: "", orden: 0 });
                  } else {
                    setEdit(f._id);
                    setForm({ pregunta: f.pregunta, respuesta: f.respuesta, orden: f.orden ?? 0 });
                    setMostrarNuevo(false);
                  }
                }}
                className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition ${abierto ? "bg-white text-lila-900 border border-stone-200" : "bg-lila-100 text-lila-900 hover:bg-lila-200"}`}
              >
                {abierto ? "Cerrar" : "Editar"}
              </button>
              <button onClick={() => eliminar(f._id)} aria-label="Eliminar" className="w-9 h-9 rounded-full bg-rosa-100 text-lila-900 grid place-items-center shrink-0 hover:bg-rosa-200 transition"><Trash2 size={15} /></button>
            </div>
            {abierto && (
              <div className="px-4 pb-4 pt-3 space-y-3 bg-white">
                <div><p className={labelCls}>Pregunta</p><input value={form.pregunta} onChange={(e) => setForm({ ...form, pregunta: e.target.value })} className={`${inputCls} mt-1.5`} /></div>
                <div><p className={labelCls}>Respuesta</p><textarea rows={3} value={form.respuesta} onChange={(e) => setForm({ ...form, respuesta: e.target.value })} className={`${inputCls} mt-1.5 resize-none`} /></div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={guardar} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition"><Save size={15} /> Guardar</button>
                  <button onClick={() => { setEdit(null); setForm({ pregunta: "", respuesta: "", orden: 0 }); }} className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition bg-white">Cancelar</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <Msg texto={msg} ok={ok} />
    </div>
  );
}

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const ESTADOS = ["pendiente", "confirmado", "cancelado", "completado"];
const GRILLA_HORAS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

function SeccionAgenda() {
  const { datos, recargar } = useDatos();
  const [filtro, setFiltro] = useState("todos");
  const [diaSel, setDiaSel] = useState("todos");
  const [form, setForm] = useState({ dia: "Lun", hora: "", nombre: "", detalle: "", estado: "pendiente", fecha: "", notas: "" });
  const [edit, setEdit] = useState(null);
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [mostrarHorarios, setMostrarHorarios] = useState(false);
  const [horasEdit, setHorasEdit] = useState({});
  const [guardandoHoras, setGuardandoHoras] = useState(false);
  const [borradores, setBorradores] = useState({});
  const [guardandoCambios, setGuardandoCambios] = useState(false);
  const [mostrarInterruptor, setMostrarInterruptor] = useState(false);
  const cambiosPendientes = Object.keys(borradores).length;

  useEffect(() => {
    const mapa = {};
    DIAS.forEach((d) => { mapa[d] = []; });
    (datos.horarios?.dias || []).forEach((h) => { mapa[h.dia] = [...(h.horas || [])]; });
    setHorasEdit(mapa);
  }, [datos.horarios]);

  const toggleHora = (dia, hora) => {
    setHorasEdit((m) => ({
      ...m,
      [dia]: (m[dia] || []).includes(hora) ? m[dia].filter((h) => h !== hora) : [...(m[dia] || []), hora].sort(),
    }));
  };

  const guardarHorarios = async () => {
    setGuardandoHoras(true);
    try {
      await api.updateHorarios({ dias: DIAS.map((dia) => ({ dia, horas: horasEdit[dia] || [] })) });
      recargar("horarios");
      setMsg("Horarios guardados ✓");
      setOk(true);
    } catch (e) { setMsg(e.message); setOk(false); }
    finally { setGuardandoHoras(false); }
  };

  const lista = Object.entries(datos.turnos || {}).flatMap(([dia, arr]) =>
    (arr || []).map((t) => ({ ...t, dia: t.dia || dia }))
  );
  const porDia = (d) => lista.filter((t) => t.dia === d);
  const filtrada = lista.filter(
    (t) => (filtro === "todos" || t.estado === filtro) && (diaSel === "todos" || t.dia === diaSel)
  );

  const guardar = async () => {
    if (!form.dia || !form.hora.trim() || !form.nombre.trim()) { setMsg("Día, hora y nombre son requeridos"); setOk(false); return; }
    try {
      const body = {
        dia: form.dia,
        hora: form.hora.trim(),
        nombre: form.nombre.trim(),
        detalle: form.detalle.trim(),
        estado: form.estado,
        notas: form.notas.trim(),
        ...(form.fecha ? { fecha: form.fecha } : {}),
      };
      if (edit) await api.updateTurno(edit, body);
      else await api.createTurno(body);
      setOk(true);
      setMsg(edit ? "Turno guardado ✓" : "Turno creado ✓");
      recargar("turnos");
      setForm({ dia: "Lun", hora: "", nombre: "", detalle: "", estado: "pendiente", fecha: "", notas: "" });
      setEdit(null);
      setMostrarNuevo(false);
    } catch (e) { setMsg(e.message); setOk(false); }
  };

  // Cambios de estado en borrador: no tocan la DB hasta "Guardar cambios".
  const marcarEstado = (id, estadoOriginal, estadoNuevo) => {
    setBorradores((b) => {
      if (estadoNuevo === estadoOriginal) {
        const copia = { ...b };
        delete copia[id];
        return copia;
      }
      return { ...b, [id]: estadoNuevo };
    });
  };

  const guardarCambios = async () => {
    const entradas = Object.entries(borradores);
    if (!entradas.length) return;
    const libera = entradas.filter(([, e]) => e === "cancelado" || e === "completado").length;
    if (!window.confirm(`¿Guardar ${entradas.length} cambio${entradas.length > 1 ? "s" : ""} de estado?${libera ? ` ${libera} horario${libera > 1 ? "s" : ""} se liberará(n).` : ""}`)) return;
    setGuardandoCambios(true);
    try {
      await Promise.all(entradas.map(([id, estado]) => api.updateTurno(id, { estado })));
      setBorradores({});
      recargar("turnos");
      setMsg(`${entradas.length} cambio${entradas.length > 1 ? "s" : ""} guardado${entradas.length > 1 ? "s" : ""} ✓`);
      setOk(true);
    } catch (e) { setMsg(e.message); setOk(false); }
    finally { setGuardandoCambios(false); }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este turno?")) return;
    try {
      await api.deleteTurno(id);
      recargar("turnos");
      setMsg("Turno eliminado ✓");
      setOk(true);
    } catch (e) { setMsg(e.message); setOk(false); }
  };

  const empezarEditar = (t) => {
    setEdit(t._id);
    setForm({
      dia: t.dia || "Lun",
      hora: t.hora || "",
      nombre: t.nombre || "",
      detalle: t.detalle || "",
      estado: t.estado || "pendiente",
      fecha: t.fecha ? new Date(t.fecha).toISOString().slice(0, 10) : "",
      notas: t.notas || "",
    });
    setMostrarNuevo(false);
  };

  const formCampos = (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <div><p className={labelCls}>Día</p><select value={form.dia} onChange={(e) => setForm({ ...form, dia: e.target.value })} className={`${inputCls} mt-1.5`}>{DIAS.map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
        <div><p className={labelCls}>Hora</p><input value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} placeholder="09:00" className={`${inputCls} mt-1.5`} /></div>
        <div><p className={labelCls}>Estado</p><select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className={`${inputCls} mt-1.5`}>{ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}</select></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><p className={labelCls}>Nombre</p><input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre del paciente" className={`${inputCls} mt-1.5`} /></div>
        <div><p className={labelCls}>Detalle</p><input value={form.detalle} onChange={(e) => setForm({ ...form, detalle: e.target.value })} placeholder="Evaluación / Seguimiento / Online" className={`${inputCls} mt-1.5`} /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><p className={labelCls}>Fecha (opcional)</p><input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className={`${inputCls} mt-1.5`} /></div>
        <div><p className={labelCls}>Notas privadas</p><input value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} placeholder="Solo visible para admin" className={`${inputCls} mt-1.5`} /></div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={guardar} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition"><Save size={15} /> Guardar</button>
        <button onClick={() => { setEdit(null); setMostrarNuevo(false); setForm({ dia: "Lun", hora: "", nombre: "", detalle: "", estado: "pendiente", fecha: "", notas: "" }); }} className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-stone-50 transition bg-white">Cancelar</button>
      </div>
    </div>
  );

  const [cfgForm, setCfgForm] = useState({ turnosHabilitados: true, mensajeTurnosPausados: "" });
  const [guardandoCfg, setGuardandoCfg] = useState(false);

  useEffect(() => {
    setCfgForm({
      turnosHabilitados: datos.config?.turnosHabilitados ?? true,
      mensajeTurnosPausados: datos.config?.mensajeTurnosPausados ?? "",
    });
  }, [datos.config]);

  const guardarCfg = async () => {
    setGuardandoCfg(true);
    try {
      await api.updateConfig(cfgForm);
      recargar("config");
      setMsg(cfgForm.turnosHabilitados ? "Reserva de turnos activada ✓" : "Reserva de turnos pausada ✓");
      setOk(true);
    } catch (e) { setMsg(e.message); setOk(false); }
    finally { setGuardandoCfg(false); }
  };

  return (
    <div className="mt-6 space-y-3">
      {/* Interruptor general de la sección turnos */}
      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
        <button onClick={() => setMostrarInterruptor(!mostrarInterruptor)} className="w-full flex items-center justify-between px-4 py-3 text-left">
          <p className="text-sm font-bold text-lila-900">Reserva de turnos: {cfgForm.turnosHabilitados ? "activada" : "pausada"} {mostrarInterruptor ? "▾" : "▸"}</p>
          <span className="text-[11px] text-stone-400">Vacaciones / sin secretaria</span>
        </button>
        {mostrarInterruptor && (
        <>
        <div className="flex items-center justify-between gap-3 px-4 py-3 flex-wrap border-t border-stone-100">
          <div>
            <p className="text-sm font-bold text-lila-900">Reserva de turnos {cfgForm.turnosHabilitados ? "activada" : "pausada"}</p>
            <p className="text-[11px] text-stone-400">Si la pausás, se ocultan los botones y el formulario muestra un aviso.</p>
          </div>
          <button onClick={() => setCfgForm((c) => ({ ...c, turnosHabilitados: !c.turnosHabilitados }))} aria-label="Activar o pausar turnos" className={`relative w-14 h-8 rounded-full transition shrink-0 ${cfgForm.turnosHabilitados ? "bg-emerald-500" : "bg-stone-300"}`}>
            <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${cfgForm.turnosHabilitados ? "left-7" : "left-1"}`} />
          </button>
        </div>
        <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
          <div><p className={labelCls}>Mensaje cuando está pausada</p><input value={cfgForm.mensajeTurnosPausados} onChange={(e) => setCfgForm({ ...cfgForm, mensajeTurnosPausados: e.target.value })} placeholder="La reserva online está pausada..." className={`${inputCls} mt-1.5`} /></div>
          <div className="flex justify-center">
            <button onClick={guardarCfg} disabled={guardandoCfg} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition disabled:opacity-50"><Save size={15} /> {guardandoCfg ? "Guardando..." : "Guardar"}</button>
          </div>
        </div>
        </>
        )}
      </div>
      {/* Horarios habilitados por día */}
      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
        <button onClick={() => setMostrarHorarios(!mostrarHorarios)} className="w-full flex items-center justify-between px-4 py-3 text-left">
          <p className="text-sm font-bold text-lila-900">Horarios habilitados {mostrarHorarios ? "▾" : "▸"}</p>
          <span className="text-[11px] text-stone-400">Lo destildado no se muestra para reservar</span>
        </button>
        {mostrarHorarios && (
          <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
            {DIAS.map((d) => (
              <div key={d} className="flex items-start gap-3">
                <span className="w-10 shrink-0 text-xs font-bold text-lila-900 pt-2 text-center">{d}</span>
                <div className="grid flex-1 grid-cols-6 sm:grid-cols-11 gap-1">
                  {GRILLA_HORAS.map((h) => {
                    const on = (horasEdit[d] || []).includes(h);
                    const turnosHora = lista.filter((t) => t.dia === d && t.hora === h && ["pendiente", "confirmado"].includes(t.estado));
                    const hayConfirmado = turnosHora.some((t) => t.estado === "confirmado");
                    const hayPendiente = turnosHora.some((t) => t.estado === "pendiente");
                    const cls = !on
                      ? "bg-stone-50 text-stone-400 border-stone-200 line-through"
                      : hayConfirmado
                        ? "bg-blue-100 text-blue-900 border-blue-300"
                        : hayPendiente
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-emerald-100 text-emerald-800 border-emerald-200";
                    const titulo = !on ? "Deshabilitada" : hayConfirmado ? "Turno confirmado" : hayPendiente ? "Turno pendiente" : "Disponible";
                    return (
                      <button key={h} onClick={() => toggleHora(d, h)} title={titulo} className={`text-[10px] font-semibold px-1 py-1 rounded-full border transition text-center justify-self-stretch ${cls}`}>{h}{(hayConfirmado || hayPendiente) ? "•" : ""}</button>
                    );
                  })}
                </div>
              </div>
            ))}
            <p className="text-[11px] text-stone-400">Verde = disponible · <span className="text-amber-700 font-semibold">amarillo • = pendiente</span> · <span className="text-blue-700 font-semibold">azul • = confirmado</span> · gris tachada = oculta para reservar. Solo cancelado/completado/eliminado libera la hora.</p>
            <div className="flex justify-center">
              <button onClick={guardarHorarios} disabled={guardandoHoras} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition disabled:opacity-50"><Save size={15} /> {guardandoHoras ? "Guardando..." : "Guardar horarios"}</button>
            </div>
          </div>
        )}
      </div>
      {/* Calendario por día */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        <button onClick={() => setDiaSel("todos")} className={`rounded-2xl border-2 px-2 py-2.5 text-center transition ${diaSel === "todos" ? "border-lila-900 bg-lila-900 text-white shadow" : "border-stone-200 bg-white hover:border-lila-200"}`}>
          <p className={`text-[10px] font-bold tracking-widest uppercase ${diaSel === "todos" ? "text-white/80" : "text-stone-400"}`}>Todos</p>
          <p className="text-lg font-bold leading-tight">{lista.length}</p>
        </button>
        {DIAS.map((d) => {
          const n = porDia(d).length;
          const activo = diaSel === d;
          return (
            <button key={d} onClick={() => setDiaSel(activo ? "todos" : d)} className={`rounded-2xl border-2 px-2 py-2.5 text-center transition ${activo ? "border-lila-900 bg-lila-900 text-white shadow" : "border-stone-200 bg-white hover:border-lila-200"}`}>
              <p className={`text-[10px] font-bold tracking-widest uppercase ${activo ? "text-white/80" : "text-stone-400"}`}>{d}</p>
              <p className="text-lg font-bold leading-tight">{n}</p>
              <p className={`text-[10px] font-semibold ${activo ? "text-white/80" : n ? "text-emerald-600" : "text-stone-300"}`}>{n ? `${n} turno${n > 1 ? "s" : ""}` : "libre"}</p>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {["todos", ...ESTADOS].map((e) => (
            <button key={e} onClick={() => setFiltro(e)} className={`text-xs font-semibold px-4 py-2 rounded-full capitalize transition ${filtro === e ? "bg-lila-900 text-white" : "bg-lila-50 text-lila-900 hover:bg-lila-100"}`}>{e} ({e === "todos" ? lista.length : lista.filter((t) => t.estado === e).length})</button>
          ))}
        </div>
        <button onClick={() => { setEdit(null); setForm({ dia: diaSel === "todos" ? "Lun" : diaSel, hora: "", nombre: "", detalle: "", estado: "pendiente", fecha: "", notas: "" }); setMostrarNuevo(!mostrarNuevo); }} className="inline-flex items-center gap-2 bg-lila-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-lila-700 transition">
          {mostrarNuevo ? <Minus size={15} /> : <Plus size={15} />} {mostrarNuevo ? "Cerrar" : `Agregar turno${diaSel === "todos" ? "" : ` (${diaSel})`}`}
        </button>
      </div>
      {mostrarNuevo && !edit && (
        <div className="rounded-2xl border-2 border-lila-500 bg-lila-50/60 p-4 shadow space-y-3">
          <p className="text-sm font-bold text-lila-900">Nuevo turno</p>
          {formCampos}
        </div>
      )}
      {filtrada.map((t) => {
        const abierto = edit === t._id;
        return (
          <div key={t._id} className={`rounded-2xl border-2 overflow-hidden transition ${abierto ? "border-lila-500 shadow bg-lila-50/60" : "border-stone-200 hover:border-lila-200 bg-white"}`}>
            <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
              <span className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold shrink-0 bg-lila-100 text-lila-700">{t.dia}</span>
              <span className="text-sm font-bold text-lila-900">{t.hora}</span>
              <p className="text-sm text-stone-700 flex-1 min-w-[120px]">{t.nombre}{t.apellido ? ` ${t.apellido}` : ""} <span className="text-stone-400">· {t.detalle}</span></p>
              <select value={borradores[t._id] ?? t.estado} onChange={(e) => marcarEstado(t._id, t.estado, e.target.value)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border capitalize ${borradores[t._id] ? "border-amber-400 bg-amber-50" : "border-stone-200 bg-white"}`}>
                {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
              <button onClick={() => (abierto ? setEdit(null) : empezarEditar(t))} className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-lila-100 text-lila-900 hover:bg-lila-200 transition">{abierto ? "Cerrar" : "Editar"}</button>
              <button onClick={() => eliminar(t._id)} aria-label="Eliminar" className="w-9 h-9 rounded-full bg-rosa-100 text-lila-900 grid place-items-center shrink-0 hover:bg-rosa-200 transition"><Trash2 size={15} /></button>
            </div>
            {abierto && <div className="px-4 pb-4 pt-3 bg-white">{formCampos}</div>}
          </div>
        );
      })}
      {!filtrada.length && <p className="text-center text-stone-400 text-sm py-8">Sin turnos en este filtro</p>}
      {cambiosPendientes > 0 && (
        <>
        <div className="h-3" aria-hidden />
        <div className="sticky bottom-3 mx-auto max-w-md flex items-center justify-center gap-3 rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-2.5 shadow-lg">
          <p className="text-xs font-bold text-amber-900">{cambiosPendientes} cambio{cambiosPendientes > 1 ? "s" : ""} sin guardar</p>
          <div className="flex gap-2">
            <button onClick={() => setBorradores({})} className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-white transition bg-white">Descartar</button>
            <button onClick={guardarCambios} disabled={guardandoCambios} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition disabled:opacity-50"><Save size={15} /> {guardandoCambios ? "Guardando..." : "Guardar cambios"}</button>
          </div>
        </div>
        </>
      )}
      <Msg texto={msg} ok={ok} />
    </div>
  );
}

function SeccionAnuncios() {
  const { datos, recargar } = useDatos();
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState({ titulo: "", mensaje: "", imagen: "", activo: true });
  const [edit, setEdit] = useState(null);
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setLista(datos.anuncios || []);
  }, [datos.anuncios]);

  const guardar = async () => {
    if (!form.titulo.trim()) { setMsg("El título es requerido"); setOk(false); return; }
    try {
      const body = { titulo: form.titulo.trim(), mensaje: form.mensaje.trim(), imagen: form.imagen, activo: !!form.activo };
      if (edit) await api.updateAnuncio(edit, body);
      else await api.createAnuncio(body);
      setOk(true);
      setMsg(edit ? "Anuncio guardado ✓" : "Anuncio creado ✓");
      recargar("anuncios");
      setForm({ titulo: "", mensaje: "", imagen: "", activo: true });
      setEdit(null);
      setMostrarNuevo(false);
    } catch (e) { setMsg(e.message); setOk(false); }
  };

  const toggleActivo = async (a) => {
    try {
      await api.updateAnuncio(a._id, { activo: !a.activo });
      recargar("anuncios");
    } catch (e) { setMsg(e.message); setOk(false); }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este anuncio?")) return;
    try {
      await api.deleteAnuncio(id);
      recargar("anuncios");
      setMsg("Anuncio eliminado ✓");
      setOk(true);
    } catch (e) { setMsg(e.message); setOk(false); }
  };

  const empezarEditar = (a) => {
    setEdit(a._id);
    setForm({ titulo: a.titulo || "", mensaje: a.mensaje || "", imagen: a.imagen || "", activo: a.activo ?? true });
    setMostrarNuevo(false);
  };

  const campos = (
    <div className="space-y-3">
      <div><p className={labelCls}>Título</p><input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="17 de septiembre · Día de la Psicopedagogía" className={`${inputCls} mt-1.5`} /></div>
      <div><p className={labelCls}>Mensaje</p><textarea rows={3} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} placeholder="¡Feliz día! / Atiendo tal día en tal localidad / Vacaciones hasta nuevo aviso..." className={`${inputCls} mt-1.5 resize-none`} /></div>
      <div><p className={labelCls}>Imagen (opcional)</p><CampoImagen value={form.imagen} onChange={(v) => setForm({ ...form, imagen: v })} /></div>
      <label className="flex items-center gap-2 text-sm text-stone-700"><input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="w-4 h-4 accent-lila-700" /> Visible en el sitio</label>
      <div className="flex gap-2 flex-wrap">
        <button onClick={guardar} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition"><Save size={15} /> Guardar</button>
        <button onClick={() => { setEdit(null); setMostrarNuevo(false); setForm({ titulo: "", mensaje: "", imagen: "", activo: true }); }} className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-stone-50 transition bg-white">Cancelar</button>
      </div>
    </div>
  );

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-stone-500">{lista.length} anuncios · {lista.filter((a) => a.activo).length} visibles</p>
        <button onClick={() => { setEdit(null); setForm({ titulo: "", mensaje: "", imagen: "", activo: true }); setMostrarNuevo(!mostrarNuevo); }} className="inline-flex items-center gap-2 bg-lila-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-lila-700 transition">
          {mostrarNuevo ? <Minus size={15} /> : <Plus size={15} />} {mostrarNuevo ? "Cerrar" : "Agregar anuncio"}
        </button>
      </div>
      {mostrarNuevo && !edit && (
        <div className="rounded-2xl border-2 border-lila-500 bg-lila-50/60 p-4 shadow space-y-3">
          <p className="text-sm font-bold text-lila-900">Nuevo anuncio</p>
          {campos}
        </div>
      )}
      {lista.map((a) => {
        const abierto = edit === a._id;
        return (
          <div key={a._id} className={`rounded-2xl border-2 overflow-hidden transition ${abierto ? "border-lila-500 shadow bg-lila-50/60" : "border-stone-200 hover:border-lila-200 bg-white"}`}>
            <div className="flex items-center gap-3 px-4 py-3">
              {a.imagen && <img src={a.imagen} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />}
              <p className="text-sm text-stone-700 flex-1 truncate">{a.titulo}</p>
              <button onClick={() => toggleActivo(a)} title={a.activo ? "Ocultar del sitio" : "Mostrar en el sitio"} className={`relative w-12 h-7 rounded-full transition shrink-0 ${a.activo ? "bg-emerald-500" : "bg-stone-300"}`}>
                <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${a.activo ? "left-5" : "left-0.5"}`} />
              </button>
              <button onClick={() => (abierto ? setEdit(null) : empezarEditar(a))} className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-lila-100 text-lila-900 hover:bg-lila-200 transition">{abierto ? "Cerrar" : "Editar"}</button>
              <button onClick={() => eliminar(a._id)} aria-label="Eliminar" className="w-9 h-9 rounded-full bg-rosa-100 text-lila-900 grid place-items-center shrink-0 hover:bg-rosa-200 transition"><Trash2 size={15} /></button>
            </div>
            {abierto && <div className="px-4 pb-4 pt-3 bg-white">{campos}</div>}
          </div>
        );
      })}
      {!lista.length && <p className="text-center text-stone-400 text-sm py-8">Todavía no hay anuncios</p>}
      <Msg texto={msg} ok={ok} />
    </div>
  );
}

function SeccionDatos() {
  const { datos, recargar } = useDatos();
  const { usuario, verificarSesion } = useAuth();
  const [form, setForm] = useState({ whatsapp: "", email: "", direccion: "", instagram: "", horariosTexto: "", mapsUrl: "" });
  const [perfil, setPerfil] = useState({ nombre: "", email: "", avatar: "" });
  const [pass, setPass] = useState({ actual: "", nueva: "", confirmar: "" });
  const [msgDatos, setMsgDatos] = useState("");
  const [okDatos, setOkDatos] = useState(false);
  const [msgPerfil, setMsgPerfil] = useState("");
  const [okPerfil, setOkPerfil] = useState(false);
  const [msgPass, setMsgPass] = useState("");
  const [okPass, setOkPass] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [guardandoPass, setGuardandoPass] = useState(false);

  useEffect(() => {
    if (datos.datosContacto) setForm({
      whatsapp: datos.datosContacto.whatsapp || "",
      email: datos.datosContacto.email || "",
      direccion: datos.datosContacto.direccion || "",
      instagram: datos.datosContacto.instagram || "",
      horariosTexto: datos.datosContacto.horariosTexto || "",
      mapsUrl: datos.datosContacto.mapsUrl || "",
    });
  }, [datos.datosContacto]);

  useEffect(() => {
    if (usuario) setPerfil({ nombre: usuario.nombre || "", email: usuario.email || "", avatar: usuario.avatar || "" });
  }, [usuario]);

  const guardarDatos = async () => {
    setGuardando(true);
    setMsgDatos("");
    try {
      await api.updateDatos(form);
      recargar("datosContacto");
      setMsgDatos("Datos guardados ✓");
      setOkDatos(true);
    } catch (e) {
      setMsgDatos(e.message);
      setOkDatos(false);
    } finally {
      setGuardando(false);
    }
  };

  const guardarPerfil = async () => {
    setGuardandoPerfil(true);
    setMsgPerfil("");
    try {
      if (!perfil.nombre.trim() || !perfil.email.trim()) throw new Error("Nombre y email requeridos");
      await api.updatePerfil({ nombre: perfil.nombre.trim(), email: perfil.email.trim(), avatar: perfil.avatar || "" });
      setMsgPerfil("Perfil actualizado ✓");
      setOkPerfil(true);
      verificarSesion();
    } catch (e) {
      setMsgPerfil(e.message);
      setOkPerfil(false);
    } finally {
      setGuardandoPerfil(false);
    }
  };

  const cambiarPass = async () => {
    setGuardandoPass(true);
    setMsgPass("");
    try {
      if (!pass.actual || !pass.nueva || !pass.confirmar) throw new Error("Completá todos los campos");
      if (pass.nueva !== pass.confirmar) throw new Error("La confirmación no coincide");
      await api.updatePassword({ actual: pass.actual, nueva: pass.nueva, confirmar: pass.confirmar });
      setMsgPass("Contraseña cambiada ✓");
      setOkPass(true);
      setPass({ actual: "", nueva: "", confirmar: "" });
    } catch (e) {
      setMsgPass(e.message);
      setOkPass(false);
    } finally {
      setGuardandoPass(false);
    }
  };

  const cancelarDatos = () => {
    const d = datos.datosContacto || {};
    setForm({ whatsapp: d.whatsapp||"", email: d.email||"", direccion: d.direccion||"", instagram: d.instagram||"", horariosTexto: d.horariosTexto||"", mapsUrl: d.mapsUrl||"" });
    setMsgDatos("");
  };
  const cancelarPerfil = () => {
    if (usuario) setPerfil({ nombre: usuario.nombre||"", email: usuario.email||"", avatar: usuario.avatar||"" });
    setMsgPerfil("");
  };
  const cancelarPass = () => {
    setPass({ actual: "", nueva: "", confirmar: "" });
    setMsgPass("");
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-2xl border-2 border-lila-500 bg-lila-50/60 p-4 shadow space-y-4">
        <p className="text-sm font-bold text-lila-900">Perfil de administrador</p>
        <p className="text-xs text-stone-500">Foto que aparece arriba a la derecha y datos de acceso.</p>
        <div><p className={labelCls}>Foto de perfil</p><CampoImagen value={perfil.avatar} onChange={(v)=> setPerfil({...perfil, avatar: v})} /></div>
        <div><p className={labelCls}>Nombre</p><input value={perfil.nombre} onChange={(e)=> setPerfil({...perfil, nombre: e.target.value})} className={`${inputCls} mt-1.5`} /></div>
        <div><p className={labelCls}>Email (login)</p><input value={perfil.email} onChange={(e)=> setPerfil({...perfil, email: e.target.value})} className={`${inputCls} mt-1.5`} /></div>
        <div className="flex gap-2 flex-wrap justify-center">
          <button onClick={guardarPerfil} disabled={guardandoPerfil} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition disabled:opacity-50"><Save size={15} /> {guardandoPerfil ? "Guardando..." : "Guardar Cambios"}</button>
          <button onClick={cancelarPerfil} className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition bg-white">Cancelar</button>
        </div>
        <Msg texto={msgPerfil} ok={okPerfil} />
      </div>

      <div className="rounded-2xl border-2 border-lila-500 bg-lila-50/60 p-4 shadow space-y-4">
        <p className="text-sm font-bold text-lila-900">Datos y redes</p>
        {[["WhatsApp (número)", "whatsapp"], ["Email de contacto", "email"], ["Dirección", "direccion"], ["Instagram (URL)", "instagram"], ["Horarios (texto)", "horariosTexto"], ["Google Maps (URL)", "mapsUrl"]].map(([label, key]) => (
          <div key={key}><p className={labelCls}>{label}</p><input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={`${inputCls} mt-1.5`} /></div>
        ))}
        <div className="flex gap-2 flex-wrap justify-center">
          <button onClick={guardarDatos} disabled={guardando} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition disabled:opacity-50"><Save size={15} /> {guardando ? "Guardando..." : "Guardar Cambios"}</button>
          <button onClick={cancelarDatos} className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition bg-white">Cancelar</button>
        </div>
        <Msg texto={msgDatos} ok={okDatos} />
      </div>

      <div className="rounded-2xl border-2 border-lila-500 bg-lila-50/60 p-4 shadow space-y-4">
        <p className="text-sm font-bold text-lila-900">Cambiar contraseña</p>
        <p className="text-xs text-stone-500">Debe tener 8+ caracteres, mayúscula, minúscula, número y símbolo.</p>
        <div><p className={labelCls}>Contraseña actual</p><input type="password" value={pass.actual} onChange={(e)=> setPass({...pass, actual: e.target.value})} className={`${inputCls} mt-1.5`} /></div>
        <div>
          <p className={labelCls}>Nueva contraseña</p><input type="password" value={pass.nueva} onChange={(e)=> setPass({...pass, nueva: e.target.value})} className={`${inputCls} mt-1.5`} />
          {pass.nueva && (
            <div className="mt-1.5 grid grid-cols-2 gap-1 text-[11px]">
              {[
                ["8+ caracteres", pass.nueva.length >= 8],
                ["Minúscula", /[a-z]/.test(pass.nueva)],
                ["Mayúscula", /[A-Z]/.test(pass.nueva)],
                ["Número", /\d/.test(pass.nueva)],
                ["Símbolo", /[^A-Za-z0-9]/.test(pass.nueva)],
              ].map(([label, ok]) => (
                <span key={label} className={ok ? "text-emerald-600" : "text-stone-400"}>{ok ? "✓" : "○"} {label}</span>
              ))}
            </div>
          )}
        </div>
        <div><p className={labelCls}>Confirmar nueva</p><input type="password" value={pass.confirmar} onChange={(e)=> setPass({...pass, confirmar: e.target.value})} className={`${inputCls} mt-1.5`} /></div>
        <div className="flex gap-2 flex-wrap justify-center">
          <button onClick={cambiarPass} disabled={guardandoPass} className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition disabled:opacity-50"><Save size={15} /> {guardandoPass ? "Guardando..." : "Actualizar contraseña"}</button>
          <button onClick={cancelarPass} className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition bg-white">Cancelar</button>
        </div>
        <Msg texto={msgPass} ok={okPass} />
      </div>
    </div>
  );
}

const descripciones = {
  inicio: "Título, descripción e imágenes del inicio.",
  "sobre-mi": "Título, descripción, foto y certificados de la sección Sobre mí.",
  servicios: "Títulos y descripciones de los servicios.",
  informacion: "Artículos de Información, tips y recomendaciones.",
  preguntas: "Preguntas frecuentes del sitio.",
  anuncios: "Carteles flotantes del sitio: efemérides, noticias y avisos.",
  agenda: "Turnos de la semana: crear, editar estado y eliminar.",
  datos: "WhatsApp, email, dirección, redes y horarios.",
};

export default function Admin() {
  const { usuario, logout, cargando } = useAuth();

  const seccionDeHash = () => {
    const id = window.location.hash.replace("#/admin", "").replace(/^\//, "");
    return SECCIONES.some((s) => s.id === id) ? id : "inicio";
  };
  const [seccion, setSeccion] = useState(seccionDeHash);

  useEffect(() => {
    const desdeHash = () => { setSeccion(seccionDeHash()); window.scrollTo({ top: 0, behavior: "instant" }); };
    const ir = (e) => {
      if (typeof e.detail === "string") {
        setSeccion(e.detail);
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };
    window.addEventListener("admin-go", ir);
    window.addEventListener("hashchange", desdeHash);
    return () => {
      window.removeEventListener("admin-go", ir);
      window.removeEventListener("hashchange", desdeHash);
    };
  }, []);

  if (cargando) return <div className="max-w-6xl mx-auto px-5 py-16 text-center text-stone-500">Verificando sesión...</div>;
  if (!usuario) return <LoginForm />;

  return (
    <div className="overflow-x-hidden bg-gradient-to-br from-lila-50/60 via-white to-rosa-50/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-4 grid md:grid-cols-[240px_minmax(0,1fr)] gap-4 items-start w-full min-w-0">
        <nav className="hidden md:block sticky top-6 p-2.5 bg-white/55 backdrop-blur-xl border border-white/60 rounded-[20px] shadow-[0_8px_32px_rgba(61,52,99,0.08),0_2px_8px_rgba(61,52,99,0.06)] space-y-1.5 min-w-0">
          {SECCIONES.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSeccion(s.id); history.replaceState(null, "", `#/admin/${s.id}`); window.scrollTo({ top: 0, behavior: "instant" }); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all ${
                seccion === s.id ? "bg-lila-900 text-white shadow-[0_4px_16px_rgba(61,52,99,0.22)] border border-lila-800/20" : "bg-white/70 backdrop-blur-sm text-stone-600 border border-white/40 hover:bg-white/90 hover:text-lila-900 hover:shadow-sm hover:border-lila-100"
              }`}
            >
              <s.icon size={18} className="shrink-0" /> {s.label}
            </button>
          ))}
          <div className="pt-2 mt-1 border-t border-stone-200/50">
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium bg-white/50 backdrop-blur-sm text-stone-500 border border-white/30 hover:bg-white/80 hover:text-red-600 hover:border-red-100 transition-all">
              <LogOut size={18} className="shrink-0" /> Salir
            </button>
          </div>
        </nav>

        <div className="bg-white/80 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-[0_8px_32px_rgba(61,52,99,0.08)] p-4 sm:p-5 min-h-[360px] min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif-display text-2xl text-lila-900 capitalize">
                {SECCIONES.find((s) => s.id === seccion)?.label}
              </h2>
              <p className="text-sm text-stone-500 mt-1">{descripciones[seccion]}</p>
            </div>
            <button onClick={logout} className="md:hidden inline-flex items-center gap-1 text-xs font-semibold text-lila-700"><LogOut size={14} /> Salir</button>
          </div>

          {seccion === "inicio" && <SeccionInicio />}
          {seccion === "sobre-mi" && <SeccionSobreMi />}
          {seccion === "servicios" && <SeccionServicios />}
          {seccion === "informacion" && <SeccionInformacion />}
          {seccion === "preguntas" && <SeccionPreguntas />}
          {seccion === "anuncios" && <SeccionAnuncios />}
          {seccion === "agenda" && <SeccionAgenda />}
          {seccion === "datos" && <SeccionDatos />}
        </div>
      </div>
    </div>
  );
}
