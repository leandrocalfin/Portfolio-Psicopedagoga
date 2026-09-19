import { useEffect, useState } from "react";
import { HeroFromAPI } from "./components/HeroFromAPI.jsx";
import { ServiciosFromAPI } from "./components/ServiciosFromAPI.jsx";
import { SobreMiFromAPI } from "./components/SobreMiFromAPI.jsx";
import { InformacionFromAPI } from "./components/InformacionFromAPI.jsx";
import { FAQFromAPI } from "./components/FAQFromAPI.jsx";
import { ContactoFromAPI } from "./components/ContactoFromAPI.jsx";
import { TurnosFromAPI } from "./components/TurnosFromAPI.jsx";
import Admin from "./Admin.jsx";
import {
  MapPin,
  Video,
  Menu,
  MessageCircleHeart,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react";

const SECCIONES_ADMIN = [
  ["inicio", "Inicio"],
  ["sobre-mi", "Sobre mí"],
  ["servicios", "Servicios"],
  ["informacion", "Información"],
  ["datos", "Datos y redes"],
  ["agenda", "Agenda"],
];

const SITE = {
  nombre: "Estefani Salaya",
  rol: "Psicopedagoga · Niños, adolescentes y adultos",
  whatsapp: "https://wa.me/5491100000000",
};

function Navbar({ admin = false }) {
  const [open, setOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const links = [
    ["Inicio", "#top"],
    ["Sobre mí", "#sobre-mi"],
    ["Información", "#informacion"],
    ["Preguntas", "#faq"],
    ["Contacto", "#contacto"],
  ];
  const irSeccionAdmin = (id) => {
    window.dispatchEvent(new CustomEvent("admin-go", { detail: id }));
    setAdminOpen(false);
    setOpen(false);
  };
  return (
    <>
      <div className="pink-lavender-bg text-lila-900 text-center text-[12px] sm:text-[13px] font-medium tracking-wide px-4 py-2 flex items-center justify-center gap-2">
        <MapPin size={14} className="shrink-0" />
        <span>Atención presencial y online</span>
        <span className="opacity-40">•</span>
        <Video size={14} className="shrink-0" />
        <span className="hidden sm:inline">Niños, adolescentes y adultos</span>
        <span className="sm:hidden">Online</span>
      </div>
      <header className="sticky top-0 z-50 bg-lila-50/60 backdrop-blur-md border-b border-lila-100">
        <nav className="max-w-6xl mx-auto px-5 h-20 flex items-center justify-between">
          <a href={admin ? "#/admin" : "#top"} className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Logo Estefani Salaya" className="h-16 w-16 object-contain shrink-0 drop-shadow-sm" />
            <span className="leading-tight">
              <span className="block font-serif-display text-lg text-lila-900">{SITE.nombre}</span>
              <span className="block text-[11px] tracking-wide text-stone-500 -mt-1">
                {admin ? "Panel admin" : "Psicopedagoga"}
              </span>
            </span>
          </a>
          {!admin && (
            <div className="hidden lg:flex items-center gap-7 text-sm text-stone-600">
              {links.map(([label, href]) => (
                <a key={href} href={href} className="hover:text-lila-700 transition">{label}</a>
              ))}
            </div>
          )}
          {!admin ? (
            <div className="flex items-center gap-2">
              <a href="#/turnos" className="inline-flex items-center gap-1.5 pink-lavender-bg hover:brightness-95 transition text-lila-900 text-sm font-medium px-4 py-2 rounded-full">Solicitar turno</a>
              <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          ) : (
            <div className="relative flex items-center gap-2">
              <span className="hidden sm:block text-[11px] tracking-[0.2em] uppercase text-stone-400 font-semibold">Modo demo</span>
              <button onClick={() => setAdminOpen(!adminOpen)} aria-label="Abrir menú admin" className="flex items-center gap-1.5 rounded-full border border-lila-200 bg-white pl-1 pr-2 py-1 shadow-sm hover:bg-lila-50 transition">
                <img src="/sobre-mi.png" alt="Estefani Salaya" className="w-9 h-9 rounded-full object-cover object-top" />
                <ChevronDown size={16} className={`text-lila-900 transition ${adminOpen ? "rotate-180" : ""}`} />
              </button>
              {adminOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setAdminOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl border border-lila-100 shadow-xl overflow-hidden z-20">
                    <p className="px-4 pt-3 pb-2 text-[11px] tracking-[0.2em] uppercase text-stone-400 font-semibold">Opciones de admin</p>
                    <div className="px-2 pb-2">
                      {SECCIONES_ADMIN.map(([id, label]) => (
                        <button key={id} onClick={() => irSeccionAdmin(id)} className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-stone-700 hover:bg-lila-50 hover:text-lila-900 transition">{label}</button>
                      ))}
                    </div>
                    <div className="border-t border-lila-100 p-2">
                      <a href="#/" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-lila-900 hover:bg-rosa-100 transition">
                        <LogOut size={15} /> Salir / Cerrar sesión
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </nav>
        {open && !admin && (
          <div className="lg:hidden absolute top-full left-0 right-0 border-t border-lila-100 bg-lila-50/95 backdrop-blur-md px-5 flex flex-col text-sm text-center divide-y divide-lila-100 shadow-lg rounded-b-2xl">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="h-12 flex items-center justify-center text-stone-700">{label}</a>
            ))}
          </div>
        )}
      </header>
    </>
  );
}

export default function App() {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#/admin") setAdmin(true);
    if (hash === "#/turnos") setAdmin(false);
    window.addEventListener("hashchange", () => {
      if (window.location.hash === "#/admin") setAdmin(true);
      if (window.location.hash === "#/turnos") setAdmin(false);
    });
  }, []);

  if (admin) return <Admin />;

  return (
    <>
      <Navbar admin={false} />
      <main id="top">
        <HeroFromAPI />
        <ServiciosFromAPI />
        <SobreMiFromAPI />
        <InformacionFromAPI />
        <FAQFromAPI />
        <ContactoFromAPI />
      </main>
      <footer className="bg-lila-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-5 text-center text-sm">
          <p className="font-serif-display text-lg mb-2">{SITE.nombre}</p>
          <p className="text-white/70">Psicopedagoga · Niños, adolescentes y adultos</p>
          <div className="mt-4 flex justify-center gap-4">
            <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition"><MessageCircleHeart size={20} /></a>
          </div>
          <p className="mt-4 text-[11px] text-white/50">© {new Date().getFullYear()} Todos los derechos reservados</p>
        </div>
      </footer>
    </>
  );
}