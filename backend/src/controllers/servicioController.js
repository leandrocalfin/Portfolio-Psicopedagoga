import Servicio from "../models/Servicio.js";
import { getAll, createOne, updateById, deleteOne } from "./baseController.js";

export const getServicios = getAll(Servicio, "", { orden: 1, createdAt: 1 });
export const createServicio = createOne(Servicio);
export const updateServicio = updateById(Servicio);
export const deleteServicio = deleteOne(Servicio);