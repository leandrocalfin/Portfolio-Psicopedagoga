import mongoose from "mongoose";

const articuloSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    tag: { type: String, default: "General" },
    imagen: { type: String }, // URL Cloudinary
    descripcion: { type: String, required: true },
    cuerpo: [{ type: String }], // array de párrafos
    publicado: { type: Boolean, default: true },
    orden: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Articulo", articuloSchema);