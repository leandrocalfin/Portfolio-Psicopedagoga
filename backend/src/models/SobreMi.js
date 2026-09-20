import mongoose from "mongoose";

const certificadoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  organizacion: { type: String, required: true },
  imagen: { type: String }, // URL Cloudinary
  año: { type: Number },
});

const itemSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  link: { type: String, default: "" },
  orden: { type: Number, default: 0 },
});

const sobreMiSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    imagen: { type: String }, // URL Cloudinary
    items: [itemSchema],
    certificados: [certificadoSchema],
    mostrarLibro: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("SobreMi", sobreMiSchema);