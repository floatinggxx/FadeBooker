const { z } = require('zod');

const telelinkSchema = z.object({
  phone: z.string().min(7)
});

const televerifySchema = z.object({
  phone: z.string().min(7),
  pin: z.string().min(4)
});

module.exports = { telelinkSchema, televerifySchema };
