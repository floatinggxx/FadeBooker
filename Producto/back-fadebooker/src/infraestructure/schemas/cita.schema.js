const { z } = require('zod')

const citaSchema = z.object({
  id_cliente: z.coerce.number().int().positive().optional(),
  id_barbero: z.coerce.number().int().positive(),
  id_servicio: z.coerce.number().int().positive(),
  id_tienda: z.coerce.number().int().positive(),
  fecha_hora_inicio: z.string().refine((val) => {
    const date = new Date(val.replace(' ', 'T')) // Normalizar para Zod y JS
    return !isNaN(date.getTime())
  }, {
    message: "Formato de fecha u hora inválido"
  }),
  duracion_minutos: z.coerce.number().int().positive().optional(),
  notas: z.string().max(3000).optional(),
  monto_total: z.coerce.number().positive().optional(),
  metodo_pago: z.string().optional(),
  cliente_nombre: z.string().min(3).optional(),
  cliente_email: z.string().email().optional().or(z.literal('')),
  cliente_telefono: z.string().optional(),
  origen: z.string().optional()
})

const actualizarEstadoSchema = z.object({
  estado: z.enum(['confirmada', 'cancelada', 'completada', 'no_presentado']),
  motivo_cancelacion: z.string().max(500).optional()
})

module.exports = {
  citaSchema,
  actualizarEstadoSchema
}