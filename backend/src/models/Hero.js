import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    imagenes: [{ type: String }], // URLs de Cloudinary, máximo 5
  },
  { timestamps: true }
);

export default mongoose.model("Hero", heroSchema);