import mongoose from "mongoose";

const anuncioSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    mensaje: { type: String, default: "" },
    imagen: { type: String, default: "" },
    activo: { type: Boolean, default: true },
    orden: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Anuncio", anuncioSchema);
