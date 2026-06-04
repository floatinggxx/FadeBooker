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
  apiKey: process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : undefined,
  apiSecret: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : undefined,
  uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET ? process.env.CLOUDINARY_UPLOAD_PRESET.trim() : undefined,
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
      
      const warningMessage = `Cloudinary no está configurado. Variables faltantes: ${missingVars}`;

      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️  ${warningMessage}`);
        console.warn('   Cloudinary es OPCIONAL en desarrollo.');
        console.warn('   Para habilitar uploads, configura las variables de entorno en .env');
      } else {
        console.warn(`⚠️  ${warningMessage}.`);
        console.warn('   La aplicación continuará en producción, pero las operaciones de Cloudinary fallarán si se intentan usar.');
      }

      this.isConfigured = false;
      return false;
    }
    
    this.isConfigured = true;
    return true;
  }
};

cloudinaryConfig.validate();
if (cloudinaryConfig.isConfigured) {
  console.log('✅ Cloudinary configurado correctamente');
}

module.exports = cloudinaryConfig;
