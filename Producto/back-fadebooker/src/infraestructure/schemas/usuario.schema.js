const { z } = require('zod')

const usuarioSchema = z.object({
  nombre: z.string().min(2).max(100),
  apellido: z.string().max(100).optional().default(''),
  email: z.string().email(),
  telefono: z.string().max(20).optional(),
  rol: z.enum(['Cliente', 'Barbero', 'Dueño', 'Administrador']),
<<<<<<< Updated upstream
  contrasena: z.string().min(6),
  // Campos opcionales para cuando el rol es Barbero
  id_tienda: z.number().int().optional(),
  especialidad: z.string().max(100).optional(),
  anos_experiencia: z.number().int().optional(),
  servicios: z.array(z.number().int()).optional()
=======
  contrasena: z.string().min(6)
>>>>>>> Stashed changes
})

const loginSchema = z.object({
  email: z.string().email(),
  contrasena: z.string().min(1)
})

const updateUsuarioSchema = usuarioSchema.partial().extend({
  id_usuario: z.number().optional()
})

module.exports = {
  usuarioSchema,
  loginSchema,
  updateUsuarioSchema
}