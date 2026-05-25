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
        console.warn(`[VALIDATION-MIDDLEWARE] Zod Error in ${req.method} ${req.originalUrl}:`, error.errors);
<<<<<<< Updated upstream
        
        // 🛡️ Súper defensivo para evitar crash de .map
        // En algunas versiones de Zod, los errores están en .errors o .issues
        const issues = error.issues || error.errors || [];
        
        const errorDetails = Array.isArray(issues) 
          ? issues.map(err => {
              const path = (err && Array.isArray(err.path)) ? err.path.join('.') : '';
              const msg = (err && err.message) ? err.message : 'Error desconocido';
              return path ? `${path}: ${msg}` : msg;
            }).join(', ')
          : 'Error de validación desconocido';
        
        return res.status(400).json({
          status: 'error',
          message: `Error de validación: ${errorDetails}`,
          errors: Array.isArray(issues) 
            ? issues.map(err => ({
                path: (err && Array.isArray(err.path)) ? err.path.join('.') : '',
                message: (err && err.message) ? err.message : 'Error desconocido'
              }))
            : []
=======

        const safeErrors = Array.isArray(error.errors) ? error.errors : [];
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
>>>>>>> Stashed changes
        });
      }
      
      console.error(`[VALIDATION-MIDDLEWARE] Unexpected Error:`, error);
      return res.status(400).json({
        status: 'error',
<<<<<<< Updated upstream
        message: 'Error de validación inesperado',
=======
        message: 'Error de validación',
>>>>>>> Stashed changes
        errors: [{ message: error.message }]
      });
    }
  };
};

module.exports = validateRequest;
