import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    pregunta: { type: String, required: true },
    respuesta: { type: String, required: true },
    orden: { type: Number, default: 0 },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("FAQ", faqSchema);