import HorariosAtencion from "../models/HorariosAtencion.js";
import { getOne, updateOne } from "./baseController.js";

export const getHorarios = getOne(HorariosAtencion);
export const updateHorarios = updateOne(HorariosAtencion);