/**
 * Cloudinary Configuration
 * 
 * Carga las credenciales de Cloudinary desde variables de entorno
 * y proporciona la configuración necesaria para la integración.
 * 
 * Variables de entorno requeridas:
 * - CLOUDINARY_CLOUD_NAME: nombre de la cloud de Cloudinary
 * - CLOUDINARY_API_KEY: API Key de Cloudinary
 * - CLOUDINARY_API_SECRET: API Secret de Cloudinary (CONFIDENCIAL)
 */

const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || 'fadebooker_uploads',
  
  // Validar que todas las variables necesarias estén presentes
  validate: function() {
    const required = ['cloudName', 'apiKey', 'apiSecret'];
    const missing = required.filter(key => !this[key]);
    
    if (missing.length > 0) {
      throw new Error(
        `Variables de entorno de Cloudinary faltantes: ${missing.map(k => 
          k === 'cloudName' ? 'CLOUDINARY_CLOUD_NAME' : 
          k === 'apiKey' ? 'CLOUDINARY_API_KEY' : 
          'CLOUDINARY_API_SECRET'
        ).join(', ')}`
      );
    }
    return true;
  }
};

// Validar al cargar el módulo (comentar si está en desarrollo y las env vars no están configuradas)
try {
  cloudinaryConfig.validate();
} catch (error) {
  console.warn('⚠️ Cloudinary no configurado:', error.message);
}

module.exports = cloudinaryConfig;
