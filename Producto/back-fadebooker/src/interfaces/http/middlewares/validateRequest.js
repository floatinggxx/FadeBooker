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
        return res.status(400).json({
          status: 'error',
          message: 'Error de validación de datos',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      return res.status(400).json({
        status: 'error',
        message: 'Error de validación',
        details: error.message
      });
    }
  };
};

module.exports = validateRequest;
