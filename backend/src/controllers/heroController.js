import Hero from "../models/Hero.js";
import { getOne, updateOne } from "./baseController.js";

export const getHero = getOne(Hero);
export const updateHero = updateOne(Hero);