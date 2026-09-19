import DatosContacto from "../models/DatosContacto.js";
import { getOne, updateOne } from "./baseController.js";

export const getDatosContacto = getOne(DatosContacto);
export const updateDatosContacto = updateOne(DatosContacto);