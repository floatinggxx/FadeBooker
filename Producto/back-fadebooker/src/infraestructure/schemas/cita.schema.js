const { z } = require('zod')

const citaSchema = z.object({
  id_cliente: z.number().int().positive(),
  id_barbero: z.number().int().positive(),
  id_servicio: z.number().int().positive(),
  id_tienda: z.number().int().positive(),
  fecha_hora_inicio: z.string().refine((val) => {
    const date = new Date(val)
    return !isNaN(date.getTime()) && date > new Date()
  }, {
    message: "La fecha y hora deben ser en el futuro"
  }),
  duracion_minutos: z.number().int().positive().optional(),
  notas: z.string().max(500).optional(),
  monto_total: z.number().positive().optional(),
  metodo_pago: z.enum(['Efectivo', 'Tarjeta', 'Transferencia']).optional()
})

const actualizarEstadoSchema = z.object({
  estado: z.enum(['Pendiente', 'Confirmada', 'Cancelada', 'Completada']),
  motivo_cancelacion: z.string().max(500).optional()
})

module.exports = {
  citaSchema,
  actualizarEstadoSchema
}