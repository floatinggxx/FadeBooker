/**
 * Hairstyle Service
 * 
 * Contiene la lógica de negocio para la simulación de cortes de pelo
 * e integración con Cloudinary.
 */

const crypto = require('crypto');
const cloudinaryConfig = require('../../config/cloudinary.config');

class HairstyleService {
  constructor(cloudinaryConfig) {
    this.cloudinaryConfig = cloudinaryConfig;
  }

  /**
   * Genera una firma segura para permitir que el frontend suba fotos a Cloudinary
   * sin exponer el API Secret del servidor.
   * 
   * @param {Object} params - Parámetros de la subida
   * @param {string} params.folder - Carpeta en Cloudinary donde se subirá la imagen (default: 'user_photos')
   * @returns {Object} Objeto con firma, timestamp y datos necesarios para el frontend
   */
  generateUploadSignature(params = {}) {
    try {
      // Verificar que Cloudinary esté configurado
      if (!this.cloudinaryConfig.isConfigured) {
        throw new Error('Cloudinary no está configurado. Por favor, configura las variables de entorno CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, y CLOUDINARY_API_SECRET en el archivo .env');
      }

      const folder = params.folder || 'user_photos';
      const timestamp = Math.floor(Date.now() / 1000);
      
      const signParams = {
        folder: folder,
        timestamp: timestamp
      };

      if (this.cloudinaryConfig.uploadPreset) {
        signParams.upload_preset = this.cloudinaryConfig.uploadPreset;
      }
      
      // Crear string para firmar: "folder=value&upload_preset=value&timestamp=value"
      const paramsToSign = Object.keys(signParams)
        .sort()
        .map(key => `${key}=${signParams[key]}`)
        .join('&');
      
      // Firmar usando SHA-1
      const signature = crypto
        .createHash('sha1')
        .update(paramsToSign + this.cloudinaryConfig.apiSecret)
        .digest('hex');
      
      return {
        success: true,
        signature,
        timestamp,
        cloudName: this.cloudinaryConfig.cloudName,
        apiKey: this.cloudinaryConfig.apiKey,
        uploadPreset: this.cloudinaryConfig.uploadPreset,
        folder: folder
      };
    } catch (error) {
      throw new Error(`Error generando firma de subida: ${error.message}`);
    }
  }

  /**
   * Genera una URL transformada que simula un corte de pelo usando overlays tradicionales o IA Generativa (Cloudinary Generative Replace).
   * El overlay o reemplazo se ajusta sobre el cabello/rostro de la persona en la imagen.
   * 
   * Estilos disponibles:
   * - degradado: Corte con degradado de lados (Low Fade)
   * - clasico: Corte clásico tradicional (Pompadour/Side Part)
   * - moderno: Corte moderno contemporáneo (Textured Crop)
   * - mohicano: Corte mohicano (Mohawk)
   * - buzzcut: Corte rapado corto (Buzz Cut)
   * 
   * @param {Object} params - Parámetros de la simulación
   * @param {string} params.publicId - Public ID de la imagen en Cloudinary (sin extensión)
   * @param {string} params.styleId - ID del estilo de corte a simular (degradado, clasico, moderno, mohicano, buzzcut)
   * @param {boolean} [params.useAI=true] - Booleano para usar Inteligencia Artificial de Cloudinary en lugar de overlays
   * @returns {Object} Objeto con URL transformada de Cloudinary
   */
  generateHairstyleSimulation(params = {}) {
    try {
      // Verificar que Cloudinary esté configurado
      if (!this.cloudinaryConfig.isConfigured) {
        throw new Error('Cloudinary no está configurado. Por favor, configura las variables de entorno CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, y CLOUDINARY_API_SECRET en el archivo .env');
      }

      const { publicId, styleId, gender } = params;
      
      // Permitir desactivar la IA a través del body o variable de entorno (.env)
      const envUseAI = process.env.CLOUDINARY_USE_GEN_AI !== 'false';
      const useAI = params.useAI !== undefined ? (params.useAI === true || params.useAI === 'true') : envUseAI;
      
      // Validar parámetros
      if (!publicId) {
        throw new Error('El publicId de la imagen es requerido');
      }
      if (!styleId) {
        throw new Error('El styleId del corte es requerido');
      }
      
      // Mapeo tradicional de overlays
      const styleMap = {
        degradado: 'cortes/degradado',
        clasico: 'cortes/clasico',
        moderno: 'cortes/moderno',
        mohicano: 'cortes/mohicano',
        buzzcut: 'cortes/buzzcut',
        largo: 'cortes/largo',
        ondulado: 'cortes/ondulado',
        chongo: 'cortes/chongo',
        media_melena: 'cortes/media_melena',
        pixie: 'cortes/pixie'
      };

      // Mapeo para IA Generativa (Generative Replace: from hair to specified hairstyle)
      const aiPromptMap = {
        degradado: 'low fade haircut',
        clasico: 'classic pompadour hairstyle',
        moderno: 'modern textured crop haircut',
        mohicano: 'mohawk haircut',
        buzzcut: 'buzz cut haircut',
        largo: 'long layered haircut',
        ondulado: 'wavy layered haircut',
        chongo: 'messy bun hairstyle',
        media_melena: 'medium length bob hairstyle',
        pixie: 'pixie cut hairstyle'
      };

      const overlay = styleMap[styleId];
      const aiPrompt = aiPromptMap[styleId];
      
      if (!overlay || !aiPrompt) {
        throw new Error(`El estilo '${styleId}' no es válido. Opciones: ${Object.keys(styleMap).join(', ')}`);
      }

      const genderLabel = gender === 'female' ? 'women' : 'men';
      const baseUrl = `https://res.cloudinary.com/${this.cloudinaryConfig.cloudName}/image/upload`;
      let transformations = '';
      let methodUsed = '';

      if (useAI) {
        // Usar Cloudinary Generative Replace con un prompt contextualizado por género
        const fullPrompt = `${genderLabel} ${aiPrompt}`;
        transformations = `e_gen_replace:from_hair:to_${encodeURIComponent(fullPrompt)}`;
        methodUsed = 'Generative AI (Cloudinary)';
      } else {
        // Usar overlays tradicionales de rostro
        transformations = `g_face,l_${overlay.replace(/\//g, ':')},w_1.3,fl_region_relative,y_-0.1`;
        methodUsed = 'Overlay tradicional';
      }

      const simulatedImageUrl = `${baseUrl}/${transformations}/${publicId}`;

      return {
        success: true,
        simulatedImageUrl,
        styleId,
        publicId,
        useAI,
        gender: gender === 'female' ? 'female' : 'male',
        methodUsed,
        overlay: useAI ? null : overlay,
        message: 'Simulación de corte generada exitosamente'
      };
    } catch (error) {
      throw new Error(`Error generando simulación de peinado: ${error.message}`);
    }
  }
}

module.exports = HairstyleService;
