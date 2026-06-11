const { z } = require('zod');

const notificationPreferencesSchema = z.object({
  channel: z.enum(['telegram', 'sms', 'none']).optional(),
  enabled: z.boolean().optional(),
  notify_on_confirmed: z.boolean().optional(),
  notify_on_cancelled: z.boolean().optional(),
  notify_on_rescheduled: z.boolean().optional()
});

module.exports = { notificationPreferencesSchema };
