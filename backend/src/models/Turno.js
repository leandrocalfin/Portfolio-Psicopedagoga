import mongoose from "mongoose";

const turnoSchema = new mongoose.Schema(
  {
    dia: {
      type: String,
      enum: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      required: true,
    },
    hora: { type: String, required: true }, // "09:00"
    nombre: { type: String, required: true },
    detalle: { type: String }, // "Evaluación", "Seguimiento", "Primera escucha", "Online"
    estado: {
      type: String,
      enum: ["pendiente", "confirmado", "cancelado", "completado"],
      default: "pendiente",
    },
    fecha: { type: Date }, // fecha específica del turno (opcional)
    notas: { type: String }, // notas privadas del admin
  },
  { timestamps: true }
);

export default mongoose.model("Turno", turnoSchema);