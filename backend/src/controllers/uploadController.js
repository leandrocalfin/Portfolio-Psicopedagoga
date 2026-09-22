import cloudinary from "../config/cloudinary.js";
import { v4 as uuidv4 } from "uuid";

export const getSignedUploadParams = async (req, res) => {
  try {
    const { folder = "psicopedagoga", resourceType = "image" } = req.body;

    const timestamp = Math.round(Date.now() / 1000);
    const publicId = `${folder}/${uuidv4()}`;

    const paramsToSign = {
      timestamp,
      public_id: publicId,
      folder,
      resource_type: resourceType,
      transformation: "w_1200,h_1200,c_limit,q_auto",
      allowed_formats: "jpg,jpeg,png,webp",
    };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

    res.json({
      signature,
      timestamp,
      publicId,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    });
  } catch (error) {
    console.error("Error generando signed upload params:", error);
    res.status(500).json({ mensaje: "Error generando parámetros de subida firmada" });
  }
};

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