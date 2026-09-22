import { pedirConsentimiento } from "../cookies.js";
import { useDatos } from "../DataContext.jsx";

function Plantilla({ titulo, bajada, children }) {
  return (
    <div className="max-w-3xl mx-auto px-5 py-14 md:py-20">
      <a href="#/" className="text-xs font-semibold text-lila-700 underline underline-offset-4">← Volver al inicio</a>
      <h1 className="font-serif-display text-3xl md:text-4xl text-lila-900 mt-4">{titulo}</h1>
      {bajada && <p className="text-sm text-stone-500 mt-2">{bajada}</p>}
      <div className="mt-8 space-y-6 text-[15px] text-stone-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function Bloque({ n, titulo, children }) {
  return (
    <section>
      <h2 className="font-semibold text-lila-900">{n}. {titulo}</h2>
      <div className="mt-1.5 space-y-2">{children}</div>
    </section>
  );
}

export function Privacidad() {
  const { datos } = useDatos();
  const email = datos.datosContacto?.email || "hola@estefanisalaya.com";
  return (
    <Plantilla titulo="Política de Privacidad" bajada="Última actualización: 2026">
      <Bloque n="1" titulo="Quién es responsable de tus datos">
        <p>Lic. Salaya Estefani — Psicopedagoga, MPRN 886. Contacto para temas de privacidad: <a className="text-lila-700 underline underline-offset-2" href={`mailto:${email}`}>{email}</a>.</p>
      </Bloque>
      <Bloque n="2" titulo="Qué datos recogemos">
        <p><strong>Formulario de contacto:</strong> nombre, email y mensaje. <strong>Reserva de turnos:</strong> nombre, teléfono, servicio, modalidad, día y hora elegidos. <strong>Navegación:</strong> datos técnicos mínimos y cookies (ver Política de Cookies).</p>
      </Bloque>
      <Bloque n="3" titulo="Para qué los usamos">
        <p>Responder tu consulta, coordinar la primera escucha y gestionar los turnos solicitados. No usamos tus datos con fines publicitarios ni los compartimos con terceros, salvo los servicios técnicos necesarios para que el sitio funcione (alojamiento, Google reCAPTCHA antispam, Google Maps).</p>
      </Bloque>
      <Bloque n="4" titulo="Base legal y conservación">
        <p>Tratamos tus datos con tu consentimiento, bajo la Ley Nacional 25.326 de Protección de los Datos Personales (Argentina). Conservamos las consultas solo el tiempo necesario para responderlas y gestionar la relación profesional.</p>
      </Bloque>
      <Bloque n="5" titulo="Tus derechos">
        <p>Podés pedir acceso, rectificación, actualización o supresión de tus datos escribiendo a <a className="text-lila-700 underline underline-offset-2" href={`mailto:${email}`}>{email}</a>. También podés reclamar ante la Agencia de Acceso a la Información Pública.</p>
      </Bloque>
      <Bloque n="6" titulo="Menores de edad">
        <p>Las consultas sobre niños y adolescentes deben realizarlas sus padres o tutores. No recogemos datos directamente de menores de 13 años.</p>
      </Bloque>
    </Plantilla>
  );
}

export function Cookies() {
  return (
    <Plantilla titulo="Política de Cookies" bajada="Última actualización: 2026">
      <Bloque n="1" titulo="Qué son">
        <p>Pequeños archivos que se guardan en tu dispositivo para que el sitio funcione y recuerde tus preferencias, como tu elección sobre cookies.</p>
      </Bloque>
      <Bloque n="2" titulo="Qué cookies usamos">
        <p><strong>Propias y necesarias:</strong> sesión de administración y recuerdo de tu elección de cookies. Sin ellas el sitio no funciona. <strong>Terceros:</strong> Google reCAPTCHA v3 (antispam en contacto y turnos) y Google Maps (mapa de ubicación). Estos servicios pueden instalar sus propias cookies según sus políticas.</p>
      </Bloque>
      <Bloque n="3" titulo="Qué pasa si las rechazás">
        <p>El sitio sigue siendo visible, pero los formularios de contacto y reserva de turnos quedan deshabilitados, porque requieren la verificación antispam de Google. Igual podés escribir por WhatsApp o email.</p>
      </Bloque>
      <Bloque n="4" titulo="Cambiar tu elección">
        <p>Podés modificar tu decisión cuando quieras: <button onClick={pedirConsentimiento} className="text-lila-700 underline underline-offset-2 font-semibold">cambiar mi elección de cookies</button>.</p>
      </Bloque>
    </Plantilla>
  );
}

export function AvisoLegal() {
  const { datos } = useDatos();
  const email = datos.datosContacto?.email || "hola@estefanisalaya.com";
  return (
    <Plantilla titulo="Aviso Legal" bajada="Última actualización: 2026">
      <Bloque n="1" titulo="Titular del sitio">
        <p>Lic. Salaya Estefani — Psicopedagoga, matrícula profesional MPRN 886. Contacto: <a className="text-lila-700 underline underline-offset-2" href={`mailto:${email}`}>{email}</a>.</p>
      </Bloque>
      <Bloque n="2" titulo="Objeto">
        <p>Este sitio informa sobre los servicios psicopedagógicos ofrecidos (modalidad presencial y online) y permite solicitar turnos y realizar consultas.</p>
      </Bloque>
      <Bloque n="3" titulo="Contenido informativo">
        <p>Los artículos y recomendaciones publicados tienen fines informativos y no sustituyen la evaluación ni el tratamiento profesional personalizado.</p>
      </Bloque>
      <Bloque n="4" titulo="Propiedad intelectual">
        <p>Los textos, imágenes y diseño de este sitio pertenecen a su titular, salvo indicación en contrario. No está permitida su reproducción sin autorización.</p>
      </Bloque>
      <Bloque n="5" titulo="Enlaces externos">
        <p>Los enlaces a WhatsApp, Instagram, email y Google Maps dirigen a servicios de terceros, sujetos a sus propios términos y políticas.</p>
      </Bloque>
    </Plantilla>
  );
}
