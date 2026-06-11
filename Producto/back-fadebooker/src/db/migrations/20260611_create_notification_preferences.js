exports.up = async function(knex) {
  await knex.schema.createTable('NotificationPreferences', table => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().unique();
    table.string('channel', 20).notNullable().defaultTo('telegram');
    table.boolean('enabled').defaultTo(true);
    table.boolean('notify_on_confirmed').defaultTo(true);
    table.boolean('notify_on_cancelled').defaultTo(true);
    table.boolean('notify_on_rescheduled').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.raw('CREATE INDEX idx_notification_preferences_user_id ON NotificationPreferences(user_id)');
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('NotificationPreferences');
};
