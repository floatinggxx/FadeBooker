/**
 * Hairstyle Service
 * 
 * Contiene la lógica de negocio para la simulación de cortes de pelo
 * e integración con Cloudinary.
 */

const crypto = require('crypto');
const cloudinaryConfig = require('../../config/cloudinary.config');

const HairstyleService = {
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
      if (!cloudinaryConfig.isConfigured) {
        throw new Error('Cloudinary no está configurado. Por favor, configura las variables de entorno CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, y CLOUDINARY_API_SECRET en el archivo .env');
      }

      const folder = params.folder || 'user_photos';
      const timestamp = Math.floor(Date.now() / 1000);
      
      // Parámetros a firmar (deben coincidir con los que use el frontend)
      const signParams = {
        folder: folder,
        upload_preset: cloudinaryConfig.uploadPreset,
        timestamp: timestamp
      };
      
      // Crear string para firmar: "folder=value&upload_preset=value&timestamp=value"
      const paramsToSign = Object.keys(signParams)
        .sort()
        .map(key => `${key}=${signParams[key]}`)
        .join('&');
      
      // Firmar usando SHA-1
      const signature = crypto
        .createHash('sha1')
        .update(paramsToSign + cloudinaryConfig.apiSecret)
        .digest('hex');
      
      return {
        success: true,
        signature,
        timestamp,
        cloudName: cloudinaryConfig.cloudName,
        apiKey: cloudinaryConfig.apiKey,
        uploadPreset: cloudinaryConfig.uploadPreset,
        folder: folder
      };
    } catch (error) {
      throw new Error(`Error generando firma de subida: ${error.message}`);
    }
  },

  /**
   * Genera una URL transformada que simula un corte de pelo usando overlays.
   * El overlay se superpone sobre el rostro de la persona en la imagen.
   * 
   * Estilos disponibles:
   * - degradado: Corte con degradado de lados
   * - clasico: Corte clásico tradicional
   * - moderno: Corte moderno contemporáneo
   * - mohicano: Corte mohicano
   * - buzzcut: Corte rapado corto
   * 
   * @param {Object} params - Parámetros de la simulación
   * @param {string} params.publicId - Public ID de la imagen en Cloudinary (sin extensión)
   * @param {string} params.styleId - ID del estilo de corte a simular (degradado, clasico, moderno, mohicano, buzzcut)
   * @returns {Object} Objeto con URL transformada de Cloudinary
   */
  generateHairstyleSimulation(params = {}) {
    try {
      // Verificar que Cloudinary esté configurado
      if (!cloudinaryConfig.isConfigured) {
        throw new Error('Cloudinary no está configurado. Por favor, configura las variables de entorno CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, y CLOUDINARY_API_SECRET en el archivo .env');
      }

      const { publicId, styleId } = params;
      
      // Validar parámetros
      if (!publicId) {
        throw new Error('El publicId de la imagen es requerido');
      }
      if (!styleId) {
        throw new Error('El styleId del corte es requerido');
      }
      
      // Mapeo de estilos a rutas de overlay en Cloudinary
      const styleMap = {
        degradado: 'cortes/degradado',
        clasico: 'cortes/clasico',
        moderno: 'cortes/moderno',
        mohicano: 'cortes/mohicano',
        buzzcut: 'cortes/buzzcut'
      };
      
      // Validar que el estilo existe
      if (!styleMap[styleId]) {
        const validStyles = Object.keys(styleMap).join(', ');
        throw new Error(`Estilo de corte no válido: ${styleId}. Estilos válidos: ${validStyles}`);
      }
      
      const overlayPath = styleMap[styleId];
      
      // Construir la transformación de Cloudinary
      // Sintaxis: c_scale,h_400,w_400,g_faces para centrar en rostros
      // l_layerName para agregar overlay
      const transformations = [
        'c_fill',           // crop fill (llenar el espacio)
        'h_400',            // altura
        'w_400',            // ancho
        'g_faces',          // gravity: faces (centrar en rostro)
        'q_auto',           // calidad automática
        'f_auto'            // formato automático
      ];
      
      // Agregar overlay del corte
      transformations.push(`l_${overlayPath.replace(/\//g, ':')}`);  // layer (overlay)
      transformations.push('fl_layer_apply');                         // aplicar capa
      transformations.push('g_gravity,x_0,y_0');                      // posicionar overlay
      
      // Construir la URL completa de Cloudinary
      const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;
      const transformString = transformations.join('/');
      const simulatedImageUrl = `${baseUrl}/${transformString}/${publicId}.jpg`;
      
      return {
        success: true,
        simulatedImageUrl,
        styleId,
        publicId,
        overlay: overlayPath,
        message: 'Simulación de corte generada exitosamente'
      };
    } catch (error) {
      throw new Error(`Error generando simulación de corte: ${error.message}`);
    }
  }
};

module.exports = HairstyleService;
