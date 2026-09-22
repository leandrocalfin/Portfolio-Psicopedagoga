import Turno from "../models/Turno.js";
import HorariosAtencion from "../models/HorariosAtencion.js";
import { getAll, createOne, updateById, deleteOne } from "./baseController.js";
import { verifyRecaptcha } from "../utils/recaptcha.js";

const ordenDias = { Lun: 1, Mar: 2, Mié: 3, Jue: 4, Vie: 5, Sáb: 6, Dom: 7 };

export const getTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find().sort({ createdAt: -1 });
    // Agrupar por día y ordenar
    const agrupados = turnos.reduce((acc, t) => {
      if (!acc[t.dia]) acc[t.dia] = [];
      acc[t.dia].push(t);
      return acc;
    }, {});
    Object.keys(agrupados).forEach((dia) => {
      agrupados[dia].sort((a, b) => a.hora.localeCompare(b.hora));
    });
    const ordenado = Object.keys(agrupados)
      .sort((a, b) => ordenDias[a] - ordenDias[b])
      .reduce((obj, key) => {
        obj[key] = agrupados[key];
        return obj;
      }, {});
    res.json(ordenado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error del servidor", error: error.message });
  }
};

export const createTurno = createOne(Turno);
export const updateTurno = updateById(Turno);
export const deleteTurno = deleteOne(Turno);

// Reserva pública (sin login): crea el turno en pendiente.
// El admin lo ve en el panel aunque el visitante nunca mande el WhatsApp.
export const reservarTurno = async (req, res) => {
  try {
    const { dia, hora, nombre, telefono, servicio, modalidad, detalle, fecha, recaptchaToken } = req.body;

    // Verificar reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(recaptchaToken, "reservar_turno");
    if (!recaptchaResult.success) {
      return res.status(400).json({ mensaje: "Verificación de seguridad fallida", error: recaptchaResult.error });
    }

    if (!dia || !hora || !nombre || !telefono) {
      return res.status(400).json({ mensaje: "Día, hora, nombre y teléfono son requeridos" });
    }

    // 1) La hora tiene que estar habilitada para ese día
    const horarios = await HorariosAtencion.findOne();
    const habilitadas = horarios?.dias?.find((d) => d.dia === dia)?.horas || [];
    if (habilitadas.length && !habilitadas.includes(hora)) {
      return res.status(400).json({ mensaje: "Ese horario no está habilitado" });
    }

    // 2) No puede haber otro pendiente/confirmado en ese día+hora (+fecha si viene)
    const filtro = { dia, hora, estado: { $in: ["pendiente", "confirmado"] } };
    if (fecha) filtro.fecha = new Date(fecha);
    const existente = await Turno.findOne(filtro);
    if (existente) {
      return res.status(409).json({ mensaje: "Ese horario acaba de ocuparse, elegí otro" });
    }

    const turno = await Turno.create({
      dia,
      hora,
      nombre: String(nombre).trim(),
      telefono: String(telefono).trim(),
      servicio: servicio || "",
      modalidad: modalidad || "",
      detalle: detalle || servicio || "",
      estado: "pendiente",
      origen: "web",
      ...(fecha ? { fecha: new Date(fecha) } : {}),
    });

    res.status(201).json(turno);
  } catch (error) {
    res.status(400).json({ mensaje: "No se pudo registrar la reserva", error: error.message });
  }
};