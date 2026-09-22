import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas API
app.use("/api", routes);

// Health check
app.get("/health", (_, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// Servir frontend en producción
if (isProd) {
  const distPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(distPath));
  app.get("*", (_, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  // 404 solo para API en desarrollo
  app.use("/api/*", (_, res) => res.status(404).json({ mensaje: "Ruta no encontrada" }));
}

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

// Iniciar servidor (aunque falle Mongo, para no romper el proxy de Vite)
const start = async () => {
  const dbOk = await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV}`);
    console.log(`MongoDB: ${dbOk ? "conectado" : "NO conectado (modo degradado)"}`);
  });
};

start();