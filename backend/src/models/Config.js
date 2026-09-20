import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    turnosHabilitados: { type: Boolean, default: true },
    mensajeTurnosPausados: {
      type: String,
      default: "La reserva online está pausada por el momento. Escribinos por WhatsApp y coordinamos tu turno.",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Config", configSchema);
