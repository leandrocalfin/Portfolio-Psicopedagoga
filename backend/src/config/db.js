import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`Error conectando a MongoDB: ${error.message}`);
    console.error("El servidor seguirá corriendo sin DB. Revisá la whitelist de IPs en Atlas.");
    return false;
  }
};