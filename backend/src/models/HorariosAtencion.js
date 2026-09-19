import mongoose from "mongoose";

const horarioDiaSchema = new mongoose.Schema({
  dia: {
    type: String,
    enum: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    required: true,
  },
  horas: [{ type: String }], // ["09:00", "10:00", ...]
});

const horariosAtencionSchema = new mongoose.Schema(
  {
    dias: [horarioDiaSchema],
  },
  { timestamps: true }
);

export default mongoose.model("HorariosAtencion", horariosAtencionSchema);