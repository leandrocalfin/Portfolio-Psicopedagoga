import FAQ from "../models/FAQ.js";
import { getAll, createOne, updateById, deleteOne } from "./baseController.js";

export const getFAQs = getAll(FAQ, "", { orden: 1, createdAt: 1 });
export const createFAQ = createOne(FAQ);
export const updateFAQ = updateById(FAQ);
export const deleteFAQ = deleteOne(FAQ);