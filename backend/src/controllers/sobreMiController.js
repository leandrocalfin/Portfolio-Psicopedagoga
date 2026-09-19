import SobreMi from "../models/SobreMi.js";
import { getOne, updateOne } from "./baseController.js";

export const getSobreMi = getOne(SobreMi);
export const updateSobreMi = updateOne(SobreMi);