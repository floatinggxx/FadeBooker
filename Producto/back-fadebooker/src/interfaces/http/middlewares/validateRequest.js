const { z } = require('zod');

/**
 * Middleware genérico para validación de requests usando Zod.
 * Cumple con la Ley del Proyecto: Validación vía Zod para esquemas de entrada.
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.warn(`[VALIDATION-MIDDLEWARE] Zod Error: ${error.message}`);
        // 🛡️ Súper defensivo para evitar crash de .map y soportar tanto Power Apps como React
        const issues = error.errors || error.issues || [];
        const safeErrors = Array.isArray(issues) ? issues : [];
        
        const errorDetails = safeErrors.map(err => {
          const path = (err && Array.isArray(err.path)) ? err.path.join('.') : '';
          const msg = (err && err.message) ? err.message : 'Error desconocido';
          return path ? `${path}: ${msg}` : msg;
        }).join(', ');
        
        return res.status(400).json({
          status: 'error',
          message: `Error de validación: ${errorDetails}`,
          errors: safeErrors.map(err => ({
            path: (err && Array.isArray(err.path)) ? err.path.join('.') : '',
            message: (err && err.message) ? err.message : 'Error desconocido'
          }))
        });
      }
      
      return res.status(400).json({
        status: 'error',
        message: 'Error de validación',
        errors: [{ message: error.message }]
      });
    }
  };
};

module.exports = validateRequest;
