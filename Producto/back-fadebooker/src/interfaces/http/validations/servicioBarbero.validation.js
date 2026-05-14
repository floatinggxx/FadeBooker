const { z } = require('zod');

/**
 * Esquema de validación para el modelo Servicio.
 * Basado en la tabla dbo.Servicio.
 */
const ServicioSchema = z.object({
  nombre_servicio: z.string({
    required_error: "El nombre del servicio es obligatorio",
    invalid_type_error: "El nombre debe ser una cadena de texto"
  }).min(3, "El nombre debe tener al menos 3 caracteres").max(150),
  
  descripcion: z.string().optional(),
  
  duracion_minutos: z.number({
    required_error: "La duración es obligatoria",
    invalid_type_error: "La duración debe ser un número"
  }).positive("La duración debe ser mayor a 0"),
  
  precio_base: z.number({
    required_error: "El precio base es obligatorio",
    invalid_type_error: "El precio debe ser un número"
  }).min(0, "El precio no puede ser negativo"),
  
  activo: z.boolean().default(true)
});

/**
 * Esquema de validación para el modelo Barbero.
 * Basado en la tabla dbo.Barbero.
 */
const BarberoSchema = z.object({
  id_usuario: z.number({
    required_error: "El ID de usuario es obligatorio"
  }),
  
  id_tienda: z.number({
    required_error: "El ID de tienda es obligatorio"
  }),
  
  especialidad: z.string().max(150).optional(),
  
  anos_experiencia: z.number().min(0, "Los años de experiencia no pueden ser negativos").optional(),
  
  tarifa_base: z.number().min(0, "La tarifa base no puede ser negativa").optional(),
  
  foto_perfil_url: z.string().url("Debe ser una URL válida").optional().or(z.literal('')),
  
  activo: z.boolean().default(true)
});

/**
 * Esquema para la relación ServicioBarbero.
 */
const ServicioBarberoSchema = z.object({
  id_servicio: z.number({
    required_error: "El ID de servicio es obligatorio"
  }),
  
  id_barbero: z.number({
    required_error: "El ID de barbero es obligatorio"
  }),
  
  precio_barbero: z.number().min(0).nullable().optional(),
  
  tiempo_servicio_minutos: z.number().positive().nullable().optional(),
  
  disponible: z.boolean().default(true)
});

module.exports = {
  ServicioSchema,
  BarberoSchema,
  ServicioBarberoSchema
};
