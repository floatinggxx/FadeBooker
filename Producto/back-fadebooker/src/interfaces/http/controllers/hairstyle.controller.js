/**
 * Hairstyle Controller
 * 
 * Maneja las solicitudes HTTP relacionadas con simulación de cortes de pelo
 * y gestión de imágenes en Cloudinary.
 */

const HairstyleService = require('../../../application/usecases/hairstyle.service');
const cloudinaryConfig = require('../../../config/cloudinary.config');

const hairstyleService = new HairstyleService(cloudinaryConfig);

const HairstyleController = {
  /**
   * POST /api/hairstyle/signature
   * 
   * Genera una firma segura para que el frontend suba fotos directamente a Cloudinary.
   * 
   * Body (opcional):
   * {
   *   "folder": "user_photos" // default: user_photos
   * }
   * 
   * Response:
   * {
   *   "success": true,
   *   "signature": "...",
   *   "timestamp": 1234567890,
   *   "cloudName": "...",
   *   "apiKey": "...",
   *   "uploadPreset": "...",
   *   "folder": "user_photos"
   * }
   */
  async generateUploadSignature(req, res) {
    try {
      const { folder } = req.body || {};
      const result = hairstyleService.generateUploadSignature({ folder });
      res.status(200).json(result);
    } catch (error) {
      console.error('Error en generateUploadSignature:', error.message);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * POST /api/hairstyle/simulate
   * 
   * Genera una URL simulada del corte de pelo sobre una foto.
   * 
   * Body:
   * {
   *   "publicId": "users/photo_123",
   *   "styleId": "degradado" // options: degradado, clasico, moderno, mohicano, buzzcut
   * }
   * 
   * Response:
   * {
   *   "success": true,
   *   "simulatedImageUrl": "https://res.cloudinary.com/.../",
   *   "styleId": "degradado",
   *   "publicId": "users/photo_123",
   *   "overlay": "cortes/degradado",
   *   "message": "Simulación de corte generada exitosamente"
   * }
   */
  async generateHairstyleSimulation(req, res) {
    try {
      const { publicId, styleId, useAI, gender } = req.body || {};
      
      // Validación básica del request
      if (!publicId || !styleId) {
        return res.status(400).json({
          success: false,
          error: 'Los parámetros publicId y styleId son requeridos'
        });
      }
      
      const result = hairstyleService.generateHairstyleSimulation({
        publicId,
        styleId,
        useAI,
        gender
      });
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error en generateHairstyleSimulation:', error.message);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = HairstyleController;
