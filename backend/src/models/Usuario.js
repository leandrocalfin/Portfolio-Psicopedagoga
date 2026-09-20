import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String, default: "" },
    rol: { type: String, enum: ["admin"], default: "admin" },
    activo: { type: Boolean, default: true },
    ultimoLogin: { type: Date },
  },
  { timestamps: true }
);

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

usuarioSchema.methods.compararPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("Usuario", usuarioSchema);