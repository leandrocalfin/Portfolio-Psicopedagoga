import Config from "../models/Config.js";
import { getOne, updateOne } from "./baseController.js";

export const getConfig = getOne(Config);
export const updateConfig = updateOne(Config);
