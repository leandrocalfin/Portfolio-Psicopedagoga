import mongoose from "mongoose";

const datosContactoSchema = new mongoose.Schema(
  {
    whatsapp: { type: String, required: true },
    email: { type: String, required: true },
    direccion: { type: String, required: true },
    instagram: { type: String },
    horariosTexto: { type: String }, // "Lun a Vie · 9 a 18 hs"
    mapsUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("DatosContacto", datosContactoSchema);