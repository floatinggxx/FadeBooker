const { z } = require('zod')

const usuarioSchema = z.object({
  nombre: z.string().min(2).max(100),
  apellido: z.string().max(100).optional().default(''),
  email: z.string().email(),
  telefono: z.string().max(20).optional(),
  rol: z.enum(['Cliente', 'Barbero', 'Dueño', 'Proveedor', 'Administrador']),
  contrasena: z.string().min(6),
  id_tienda: z.union([z.number().int(), z.string().transform(v => v === '' ? undefined : Number(v))]).optional(),
  especialidad: z.string().max(100).optional(),
  anos_experiencia: z.union([z.number().int(), z.string().transform(v => v === '' ? undefined : Number(v))]).optional().nullable(),
  servicios: z.array(z.number().int()).optional(),
  tienda_nueva: z.object({
    nombre_tienda: z.string().min(2).max(150),
    direccion: z.string().min(2).max(250),
    ciudad: z.string().min(2).max(100),
    comuna: z.string().min(2).max(100).optional()
  }).optional()
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
