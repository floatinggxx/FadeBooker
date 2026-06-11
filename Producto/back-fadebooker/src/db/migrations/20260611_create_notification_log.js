exports.up = async function(knex) {
  await knex.schema.createTable('NotificationLog', table => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.integer('appointment_id').nullable();
    table.string('notification_type', 50).notNullable();
    table.string('channel', 20).notNullable();
    table.string('status', 20).notNullable();
    table.string('message_text', 500).nullable();
    table.string('error_reason', 500).nullable();
    table.bigInteger('telegram_id').nullable();
    table.string('phone', 20).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.raw('CREATE INDEX idx_notification_log_user_id ON NotificationLog(user_id)');
  await knex.raw('CREATE INDEX idx_notification_log_appointment_id ON NotificationLog(appointment_id)');
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('NotificationLog');
};
