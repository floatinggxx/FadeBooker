const { z } = require('zod')

const pagoCrearSchema = z.object({
  id_cita: z.number().int().positive(),
  tipo_pago: z.enum(['total', 'abono']).optional().default('total')
})

const pagoCitaParamsSchema = z.object({
  id_cita: z.coerce.number().int().positive()
})

module.exports = {
  pagoCrearSchema,
  pagoCitaParamsSchema
}
