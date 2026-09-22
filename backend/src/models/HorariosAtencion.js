import mongoose from "mongoose";

const horarioDiaSchema = new mongoose.Schema({
  dia: {
    type: String,
    enum: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    required: true,
  },
  // Semana 1 = próximos 5 días hábiles, semana 2 = siguientes 5.
  // Entradas viejas sin semana valen para ambas (compatibilidad).
  semana: { type: Number, enum: [1, 2], default: 1 },
  horas: [{ type: String }], // ["09:00", "10:00", ...]
});

const horariosAtencionSchema = new mongoose.Schema(
  {
    dias: [horarioDiaSchema],
  },
  { timestamps: true }
);

export default mongoose.model("HorariosAtencion", horariosAtencionSchema);