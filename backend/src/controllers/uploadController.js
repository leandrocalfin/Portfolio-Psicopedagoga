import cloudinary from "../config/cloudinary.js";

export const uploadImagen = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ mensaje: "No se subió ningún archivo" });
    }
    res.json({ url: req.file.path, publicId: req.file.filename });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al subir imagen", error: error.message });
  }
};

export const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ mensaje: "No se subieron archivos" });
    }
    const imagenes = req.files.map((f) => ({ url: f.path, publicId: f.filename }));
    res.json({ imagenes });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al subir imágenes", error: error.message });
  }
};

export const deleteImagen = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ mensaje: "publicId requerido" });
    }
    await cloudinary.uploader.destroy(publicId);
    res.json({ mensaje: "Imagen eliminada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar imagen", error: error.message });
  }
};