/**
 * Cloudinary Configuration
 * 
 * Carga las credenciales de Cloudinary desde variables de entorno
 * y proporciona la configuración necesaria para la integración.
 * 
 * Variables de entorno:
 * - CLOUDINARY_CLOUD_NAME: nombre de la cloud de Cloudinary
 * - CLOUDINARY_API_KEY: API Key de Cloudinary
 * - CLOUDINARY_API_SECRET: API Secret de Cloudinary (CONFIDENCIAL)
 * 
 * En desarrollo (NODE_ENV=development), Cloudinary es OPCIONAL.
 * En producción, todas las variables son REQUERIDAS.
 */

const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.toLowerCase().trim() : undefined,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET ? process.env.CLOUDINARY_UPLOAD_PRESET.trim() : 'fadebooker_uploads',
  isConfigured: false,
  
  // Validar que todas las variables necesarias estén presentes
  validate: function() {
    const required = ['cloudName', 'apiKey', 'apiSecret'];
    const missing = required.filter(key => !this[key]);
    
    if (missing.length > 0) {
      const missingVars = missing.map(k => 
        k === 'cloudName' ? 'CLOUDINARY_CLOUD_NAME' : 
        k === 'apiKey' ? 'CLOUDINARY_API_KEY' : 
        'CLOUDINARY_API_SECRET'
      ).join(', ');
      
      // En desarrollo, solo mostrar advertencia
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️  Cloudinary no configurado (variables faltantes: ${missingVars})`);
        console.warn('   Cloudinary es OPCIONAL en desarrollo.');
        console.warn('   Para habilitar uploads, configura las variables de entorno en .env');
        this.isConfigured = false;
        return false;
      } else {
        // En producción, lanzar error
        throw new Error(
          `Variables de entorno de Cloudinary faltantes: ${missingVars}`
        );
      }
    }
    
    this.isConfigured = true;
    return true;
  }
};

// Validar al cargar el módulo
try {
  cloudinaryConfig.validate();
  if (cloudinaryConfig.isConfigured) {
    console.log('✅ Cloudinary configurado correctamente');
  }
} catch (error) {
  console.error('❌ Error en configuración de Cloudinary:', error.message);
  throw error;
}

module.exports = cloudinaryConfig;
