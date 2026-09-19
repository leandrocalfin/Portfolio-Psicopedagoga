import mongoose from "mongoose";

const servicioSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    icono: { type: String }, // nombre del icono de lucide-react
    orden: { type: Number, default: 0 },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Servicio", servicioSchema);