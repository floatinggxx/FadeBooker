/**
 * @file CloudinaryService.js
 * @description Servicio de gestión de imágenes en Cloudinary para FadeBooker.
 * @author @photographer-ai-agent
 * @version 1.0.0
 */

const cloudinary = require('cloudinary').v2;

// Configuración de Cloudinary usando variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

class CloudinaryService {
  /**
   * Sube una imagen a Cloudinary.
   * @param {string} filePath - Ruta local del archivo o buffer.
   * @param {string} folder - Carpeta de destino en Cloudinary.
   */
  static async uploadImage(filePath, folder = 'fadebooker_uploads') {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        use_filename: true,
        unique_filename: true,
        resource_type: 'auto'
      });
      return result;
    } catch (error) {
      console.error('--- CLOUDINARY UPLOAD ERROR ---');
      console.error(error);
      
      // Lanzar el mensaje de error real para facilitar el diagnóstico
      const errorMessage = error.message || 'Error desconocido al subir a Cloudinary';
      throw new Error(`Fallo al subir la imagen a Cloudinary: ${errorMessage}`);
    }
  }

  /**
   * Genera una URL de imagen con transformaciones para simular estilos.
   * @param {string} publicId - ID público de la imagen en Cloudinary.
   * @param {string} style - Estilo deseado ('sepia', 'grayscale', 'vibrant', 'portrait', 'modern_cut').
   */
  static getSimulatedStyleUrl(publicId, style = 'vibrant') {
    let transformation = [];

    switch (style) {
      case 'sepia':
        transformation = [{ effect: "sepia:80" }, { effect: "brightness:10" }];
        break;
      case 'grayscale':
        transformation = [{ effect: "grayscale" }, { quality: "auto" }];
        break;
      case 'vibrant':
        transformation = [
          { effect: "unsharp_mask:100" },
          { effect: "saturation:30" },
          { quality: "auto" }
        ];
        break;
      case 'portrait':
        transformation = [
          { width: 800, height: 1200, crop: "fill", gravity: "face" },
          { effect: "vignette:20" },
          { quality: "auto" }
        ];
        break;
      case 'modern_cut':
        transformation = [
            { width: 500, height: 500, crop: "thumb", gravity: "face", zoom: "0.75" },
            { effect: "art:incognito" }
        ];
        break;
      default:
        transformation = [{ quality: "auto" }, { fetch_format: "auto" }];
    }

    return cloudinary.url(publicId, {
      transformation: transformation,
      secure: true
    });
  }

  /**
   * Elimina una imagen de Cloudinary.
   * @param {string} publicId - ID público de la imagen a eliminar.
   */
  static async deleteImage(publicId) {
    try {
      if (!publicId) return null;
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw new Error('Fallo al eliminar la imagen de Cloudinary');
    }
  }
}

module.exports = CloudinaryService;
