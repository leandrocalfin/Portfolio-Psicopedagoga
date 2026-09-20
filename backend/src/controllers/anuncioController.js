import Anuncio from "../models/Anuncio.js";
import { getAll, createOne, updateById, deleteOne } from "./baseController.js";

export const getAnuncios = getAll(Anuncio, "", { orden: 1, createdAt: -1 });
export const createAnuncio = createOne(Anuncio);
export const updateAnuncio = updateById(Anuncio);
export const deleteAnuncio = deleteOne(Anuncio);
