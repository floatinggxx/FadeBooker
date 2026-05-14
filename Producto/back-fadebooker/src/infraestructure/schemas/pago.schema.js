const { z } = require('zod')

const pagoCrearSchema = z.object({
  id_cita: z.number().int().positive()
})

const pagoCitaParamsSchema = z.object({
  id_cita: z.coerce.number().int().positive()
})

module.exports = {
  pagoCrearSchema,
  pagoCitaParamsSchema
}
