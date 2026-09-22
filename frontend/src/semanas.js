// Lógica compartida de "2 semanas": próximos 10 días hábiles (Lun-Vie),
// primeros 5 = semana 1, siguientes 5 = semana 2. La usa la reserva pública
// (Turnos.jsx) y la agenda del admin para hablar el mismo idioma.

export const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"];

export function proximasFechas(n = 10) {
  const out = [];
  const d = new Date();
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow >= 1 && dow <= 5) {
      const id = d.toISOString().slice(0, 10);
      out.push({
        id,
        dia: DIAS_SEMANA[dow],
        numero: d.getDate(),
        mes: MESES[d.getMonth()],
        etiqueta: `${DIAS_SEMANA[dow]}, ${d.getDate()} ${MESES[d.getMonth()]}`,
        corta: `${DIAS_SEMANA[dow]} ${d.getDate()}/${d.getMonth() + 1}`,
        // Semana 1 = primeros 5, semana 2 = siguientes 5
        semana: out.length < 5 ? 1 : 2,
      });
    }
  }
  return out;
}

// Horas habilitadas para un día+semana según el doc de horarios.
// Sin entrada específica vale la legacy (sin semana) para ambas semanas.
// Devuelve null si el doc no trae nada de ese día (para aplicar fallback).
export function horasPara(dia, semana, diasDoc) {
  const cands = (diasDoc || []).filter((e) => e.dia === dia);
  if (!cands.length) return null;
  const exacta = cands.find((e) => Number(e.semana) === Number(semana));
  if (exacta) return [...(exacta.horas || [])];
  const legacy = cands.find((e) => e.semana == null);
  if (legacy) return [...(legacy.horas || [])];
  return [];
}

export function fechaCorta(iso) {
  if (!iso) return "";
  const [y, m, d] = String(iso).slice(0, 10).split("-");
  return `${d}/${m}`;
}
