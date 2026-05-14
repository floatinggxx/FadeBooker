const { z } = require('zod')

const usuarioSchema = z.object({
  nombre: z.string().min(2).max(100),
  apellido: z.string().min(2).max(100),
  email: z.string().email(),
  telefono: z.string().max(20).optional(),
  rol: z.enum(['Cliente', 'Barbero', 'Admin']),
  contrasena: z.string().min(6)
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