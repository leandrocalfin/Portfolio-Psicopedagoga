import Articulo from "../models/Articulo.js";
import { getAll, createOne, updateById, deleteOne } from "./baseController.js";

export const getArticulos = getAll(Articulo, "", { orden: -1, createdAt: -1 });
export const createArticulo = createOne(Articulo);
export const updateArticulo = updateById(Articulo);
export const deleteArticulo = deleteOne(Articulo);