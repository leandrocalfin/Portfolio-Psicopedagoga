import Turno from "../models/Turno.js";
import { getAll, createOne, updateById, deleteOne } from "./baseController.js";

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