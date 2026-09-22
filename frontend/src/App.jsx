import { useEffect, useRef, useState } from "react";
import { HeroFromAPI } from "./components/HeroFromAPI.jsx";
import { ServiciosFromAPI } from "./components/ServiciosFromAPI.jsx";
import { SobreMiFromAPI } from "./components/SobreMiFromAPI.jsx";
import { InformacionFromAPI } from "./components/InformacionFromAPI.jsx";
import { FAQFromAPI } from "./components/FAQFromAPI.jsx";
import { ContactoFromAPI } from "./components/ContactoFromAPI.jsx";
import Admin from "./Admin.jsx";
import Turnos from "./Turnos.jsx";
import { AnuncioFlotante } from "./components/AnuncioFlotante.jsx";
import { CookieBanner } from "./components/CookieBanner.jsx";
import { Privacidad, Cookies, AvisoLegal } from "./components/Legal.jsx";
import { useScrollReveal } from "./hooks/useScrollReveal.js";
// Flag demo: true = muestra sección turnos + botón "Solicitar turno",
// false = oculta todo lo de turnos sin borrar código.
export const MOSTRAR_TURNOS = true;
import { useAuth } from "./AuthContext.jsx";
import { useDatos } from "./DataContext.jsx";
import {
  MapPin,
  Video,
  Menu,
  MessageCircleHeart,
  X,
  LogOut,
  Mail,
  Lock,
} from "lucide-react";

function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

const SECCIONES_ADMIN = [
  ["inicio", "Inicio"],
  ["servicios", "Servicios"],
  ["sobre-mi", "Sobre mí"],
  ["informacion", "Información"],
  ["anuncios", "Anuncios"],
  ["agenda", "Agenda"],
  ["datos", "Datos y redes"],
];

const SITE = {
  nombre: "Estefani Salaya",
  rol: "Psicopedagoga · Niños, adolescentes y adultos",
  whatsapp: "https://wa.me/5491100000000",
};

function PerfilAdmin({ setMenuOpen }) {
  const [open, setOpen] = useState(false);
  const { logout, usuario } = useAuth();
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const cerrarAfuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const tecla = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", cerrarAfuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", cerrarAfuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [open]);

  if (!usuario) return null;

  return (
    <div ref={menuRef} className="relative">
      <button onClick={() => setOpen(!open)} aria-label="Abrir menú admin" className="rounded-full shadow-sm border border-lila-200 bg-white p-0.5 hover:bg-lila-50 transition">
        <img src={usuario.avatar || "/sobre-mi.png"} alt="Estefani Salaya" className="w-10 h-10 rounded-full object-cover object-top" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl border border-lila-100 shadow-xl overflow-hidden z-20">
          <p className="px-4 pt-3 pb-2 text-[11px] tracking-[0.2em] uppercase text-stone-400 font-semibold">Opciones de admin</p>
          <div className="px-2 pb-2">
            {SECCIONES_ADMIN.map(([id, label]) => (
              <button key={id} onClick={() => { window.location.hash = `#/admin/${id}`; window.scrollTo({ top: 0, behavior: "instant" }); setOpen(false); setMenuOpen?.(false); }} className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-stone-700 hover:bg-lila-50 hover:text-lila-900 transition">{label}</button>
            ))}
          </div>
          <div className="border-t border-lila-100 p-2">
            <a href="#/" onClick={logout} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-lila-900 hover:bg-rosa-100 transition">
              <LogOut size={15} /> Salir / Cerrar sesión
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function Navbar({ admin = false, esInicio = true }) {
  const [open, setOpen] = useState(false);
  const { usuario } = useAuth();
  const { datos } = useDatos();
  const mostrarTurnos = datos.config?.turnosHabilitados ?? MOSTRAR_TURNOS;
  const links = [
    ["Inicio", "#top"],
    ["Servicios", "#servicios"],
    ["Sobre mí", "#sobre-mi"],
    ["Información", "#informacion"],
    ["Preguntas", "#faq"],
    ["Contacto", "#contacto"],
  ];
  const irASeccion = (sel) => {
    // En turnos no existen las secciones: volver al inicio y luego scrollear.
    if (!esInicio && !admin) {
      irAlSitio(sel);
      setOpen(false);
      return;
    }
    document.querySelector(sel)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };
  const irAlSitio = (ancla) => {
    window.location.hash = "#/";
    setTimeout(() => {
      document.querySelector(ancla)?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };
  return (
    <>
      <div id="top" className="pink-lavender-bg text-lila-900 text-center text-[12px] sm:text-[13px] font-medium tracking-wide px-4 py-2 flex items-center justify-center gap-2">
        <MapPin size={14} className="shrink-0" />
        <span>Atención presencial y online</span>
        <span className="opacity-40">•</span>
        <Video size={14} className="shrink-0" />
        <span className="hidden sm:inline">Niños, adolescentes y adultos</span>
        <span className="sm:hidden">Online</span>
      </div>
      <header className="sticky top-0 z-50 bg-lila-50/60 backdrop-blur-md border-b border-lila-100">
        <nav className="max-w-6xl mx-auto px-5 h-20 flex items-center justify-between">
          <a href={admin ? "#/admin" : "#/"} onClick={(e) => { if (!admin && esInicio) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } }} className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Logo Estefani Salaya" className="h-16 w-16 object-contain shrink-0 drop-shadow-sm" />
            <span className="leading-tight">
              <span className="block font-serif-display text-[15px] md:text-lg text-lila-900">{SITE.nombre}</span>
              <span className="block text-[11px] tracking-wide text-stone-500 -mt-1">
                {admin ? "Panel admin" : "Psicopedagoga"}
              </span>
            </span>
          </a>
          {!admin && (
            <div className="hidden lg:flex items-center gap-7 text-sm text-stone-600">
              {links.map(([label, href]) => (
                <button key={href} onClick={() => irASeccion(href)} className="hover:text-lila-700 transition">{label}</button>
              ))}
            </div>
          )}
          {admin && (
            <div className="hidden lg:flex items-center gap-7 text-sm text-stone-600">
              {links.map(([label, href]) => (
                <button key={href} onClick={() => irAlSitio(href)} className="hover:text-lila-700 transition">{label}</button>
              ))}
            </div>
          )}
          {!admin ? (
            <div className="flex items-center gap-2">
              {!usuario && mostrarTurnos && <a href="#/turnos" className="relative inline-flex items-center gap-2 pink-lavender-bg hover:brightness-95 hover:scale-[1.04] transition text-lila-900 text-sm font-semibold px-5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(95,75,158,0.4)]"><span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lila-600 opacity-60" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lila-700" /></span>Solicitar turno</a>}
              {usuario && <PerfilAdmin setMenuOpen={setOpen} />}
              <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {usuario && <PerfilAdmin setMenuOpen={setOpen} />}
              <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          )}
        </nav>
        {open && !admin && (
          <div className="lg:hidden absolute top-full left-0 right-0 border-t border-lila-100 bg-lila-50/95 backdrop-blur-md px-5 flex flex-col text-sm text-center divide-y divide-lila-100 shadow-lg rounded-b-2xl">
            {links.map(([label, href]) => (
              <button key={href} onClick={() => irASeccion(href)} className="h-12 flex items-center justify-center text-stone-700">{label}</button>
            ))}
          </div>
        )}
        {open && admin && (
          <div className="lg:hidden absolute top-full left-0 right-0 border-t border-lila-100 bg-lila-50/95 backdrop-blur-md px-5 flex flex-col text-sm text-center divide-y divide-lila-100 shadow-lg rounded-b-2xl">
            {links.map(([label, href]) => (
              <button key={href} onClick={() => { setOpen(false); irAlSitio(href); }} className="h-12 flex items-center justify-center text-stone-700">{label}</button>
            ))}
          </div>
        )}
      </header>
    </>
  );
}

function WhatsAppFlotante() {
  const { datos } = useDatos();
  const numero = datos.datosContacto?.whatsapp || "5491100000000";
  return (
    <a
      href={`https://wa.me/${numero}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full grid place-items-center text-white shadow-xl hover:scale-105 transition"
      style={{ backgroundColor: "#25D366" }}
    >
      <span aria-hidden className="absolute inline-flex h-full w-full rounded-full opacity-40 animate-ping" style={{ backgroundColor: "#25D366" }} />
      <MessageCircleHeart size={26} className="relative" />
    </a>
  );
}

function Footer() {
  const { datos } = useDatos();
  const contacto = datos.datosContacto || {};
  const instagram = contacto.instagram || "https://instagram.com/";
  const email = contacto.email || "hola@estefanisalaya.com";
  const whatsapp = contacto.whatsapp ? `https://wa.me/${contacto.whatsapp}` : SITE.whatsapp;
  return (
    <footer className="relative bg-lila-900 text-white overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: "linear-gradient(90deg, #f9ce34, #ee2a7b, #8b5cf6, #25D366)" }} />
      <div aria-hidden className="pointer-events-none absolute -top-20 left-1/4 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
      <div className="relative max-w-6xl mx-auto px-4 lg:px-5 py-2.5 grid gap-1.5 lg:gap-2 md:grid-cols-3 items-center text-center">
        <div className="hidden md:flex items-center justify-center md:justify-start gap-2">
          <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-8 h-8 rounded-full grid place-items-center text-white ring-1 ring-white/25 hover:ring-white/60 hover:scale-110 hover:-translate-y-0.5 transition" style={{ backgroundColor: "#25D366" }}><WhatsAppIcon size={15} /></a>
          <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full grid place-items-center text-white ring-1 ring-white/25 hover:ring-white/60 hover:scale-110 hover:-translate-y-0.5 transition" style={{ background: "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)" }}><InstagramIcon size={15} /></a>
          <a href={`mailto:${email}`} aria-label="Email" className="w-8 h-8 rounded-full grid place-items-center text-white ring-1 ring-white/25 hover:ring-white/60 hover:scale-110 hover:-translate-y-0.5 transition" style={{ backgroundColor: "#EA4335" }}><Mail size={14} /></a>
        </div>
        <div className="flex flex-col items-center gap-1">
          <img src="/logo.png" alt="Logo Estefani Salaya" className="h-12 w-12 lg:h-14 lg:w-14 object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)]" />
          <div className="flex flex-col items-center gap-0.5 text-center">
            <p className="font-script text-xl lg:text-2xl leading-none text-white pt-1 whitespace-nowrap">Lic. Salaya Estefani</p>
            <p className="font-sans font-light text-[10px] lg:text-[11px] tracking-[0.18em] lg:tracking-[0.22em] uppercase text-white/70 whitespace-nowrap">MPRN 886</p>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 lg:gap-1 items-center text-center md:items-end md:text-right md:justify-self-end font-sans font-light tracking-[0.1em] lg:tracking-[0.14em] uppercase">
          <p className="text-[8px] md:text-[9px] text-white/60 flex items-center gap-1.5 justify-center">© {new Date().getFullYear()} — Todos los derechos reservados <a href="#/admin" aria-label="Acceso admin" title="Acceso admin" className="inline-grid place-items-center text-white/25 hover:text-white/80 transition ml-1"><Lock size={11} /></a></p>
          <p className="text-[8px] md:text-[9px] text-white/40">Sitio desarrollado por <a href="https://www.leandrocalfin.com.ar" target="_blank" rel="noreferrer" className="text-white/60 underline underline-offset-4 decoration-white/20 hover:text-white transition">Leandro Calfin</a></p>
          <p className="text-[8px] md:text-[9px] text-white/40 flex items-center gap-2 justify-center">
            <a href="#/privacidad" className="hover:text-white transition">Privacidad</a>
            <span aria-hidden>·</span>
            <a href="#/cookies" className="hover:text-white transition">Cookies</a>
            <span aria-hidden>·</span>
            <a href="#/aviso-legal" className="hover:text-white transition">Aviso legal</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function TurnosPausados() {
  const { datos } = useDatos();
  return (
    <div className="bg-lila-50/60 py-10 px-5">
      <div className="max-w-xl mx-auto bg-white rounded-[24px] card-shadow p-8 text-center">
        <h2 className="font-serif-display text-3xl text-lila-900">Reserva pausada</h2>
        <p className="text-sm text-stone-600 mt-3">{datos.config?.mensajeTurnosPausados || "La reserva online está pausada por el momento."}</p>
        <a href="#/" className="mt-6 inline-flex justify-center items-center gap-2 pink-lavender-bg text-lila-900 font-semibold px-6 py-3 rounded-full text-sm">Volver al inicio</a>
      </div>
    </div>
  );
}

export default function App() {
  const [ruta, setRuta] = useState(window.location.hash || "#/");
  const admin = ruta.startsWith("#/admin");
  const esTurnos = ruta.startsWith("#/turnos");
  const esPrivacidad = ruta.startsWith("#/privacidad");
  const esCookies = ruta.startsWith("#/cookies");
  const esAviso = ruta.startsWith("#/aviso-legal");
  const esLegal = esPrivacidad || esCookies || esAviso;
  const { datos } = useDatos();
  const mostrarTurnos = datos.config?.turnosHabilitados ?? MOSTRAR_TURNOS;

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    // Si quedó un hash viejo de sección (#sobre-mi, #servicios...), limpiarlo y volver arriba.
    // Solo se respetan las rutas "#/..." (admin, turnos).
    const h = window.location.hash;
    if (h && !h.startsWith("#/")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
      setRuta("#/");
    }
    const alCambiar = () => {
      setRuta(window.location.hash || "#/");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", alCambiar);
    return () => window.removeEventListener("hashchange", alCambiar);
  }, []);

  if (admin) return (<div className="min-h-screen flex flex-col bg-lila-50"><Navbar admin={true} /><div className="flex-1"><Admin /></div><Footer /></div>);

  if (esLegal) return (<div className="min-h-screen flex flex-col bg-white"><Navbar admin={false} esInicio={false} /><div className="flex-1">{esPrivacidad ? <Privacidad /> : esCookies ? <Cookies /> : <AvisoLegal />}</div><Footer /><CookieBanner /></div>);

  if (esTurnos && mostrarTurnos) return (<div className="min-h-screen flex flex-col bg-lila-50"><Navbar admin={false} esInicio={false} /><div className="flex-1"><Turnos /></div><Footer /><CookieBanner /></div>);
  if (esTurnos && !mostrarTurnos && datos.config) return (<div className="min-h-screen flex flex-col bg-lila-50"><Navbar admin={false} esInicio={false} /><div className="flex-1"><TurnosPausados /></div><Footer /><CookieBanner /></div>);

  return (
    <>
      <Navbar admin={false} />
      <main>
        <HeroFromAPI />
        <ScrollReveal><ServiciosFromAPI /></ScrollReveal>
        <ScrollReveal><SobreMiFromAPI /></ScrollReveal>
        <ScrollReveal><InformacionFromAPI /></ScrollReveal>
        <ScrollReveal><FAQFromAPI /></ScrollReveal>
        <ScrollReveal><ContactoFromAPI /></ScrollReveal>
      </main>
      <WhatsAppFlotante />
      <Footer />
      <AnuncioFlotante />
      <CookieBanner />
    </>
  );

  function ScrollReveal({ children }) {
    const [ref, visible] = useScrollReveal({ threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    return (
      <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        {children}
      </div>
    );
  }
}