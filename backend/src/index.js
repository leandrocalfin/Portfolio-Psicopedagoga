import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api", routes);

// Health check
app.get("/health", (_, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// 404
app.use((_, res) => res.status(404).json({ mensaje: "Ruta no encontrada" }));

// Error handler global
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  if (err.name === "ValidationError") {
    return res.status(400).json({ mensaje: "Error de validación", errores: Object.values(err.errors).map(e => e.message) });
  }
  if (err.name === "MulterError") {
    return res.status(400).json({ mensaje: "Error al subir archivo", error: err.message });
  }
  res.status(500).json({ mensaje: "Error interno del servidor" });
});

// Iniciar servidor
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Entorno: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Error al iniciar:", error);
    process.exit(1);
  }
};

start();