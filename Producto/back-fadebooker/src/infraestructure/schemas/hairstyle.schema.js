const { z } = require('zod');

/**
 * Esquema de validación para el modelo Hairstyle.
 * Basado en la tabla dbo.Hairstyle.
 */
const HairstyleSchema = z.object({
  nombre: z.string({
    required_error: "El nombre es obligatorio"
  }).min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  
  descripcion: z.string().optional(),
  
  genero: z.enum(['Masculino', 'Femenino', 'Unisex']).default('Unisex'),
  
  imagen_url: z.string().url("Debe ser una URL válida").optional().or(z.literal('')),
  
  activo: z.boolean().default(true)
});

module.exports = {
  HairstyleSchema
};
