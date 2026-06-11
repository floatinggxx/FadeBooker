exports.up = async function(knex) {
  await knex.schema.createTable('PhoneVerifications', table => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.string('phone', 20).notNullable();
    table.string('pin_hash', 255).notNullable();
    table.string('via_channel', 20).notNullable().defaultTo('telegram');
    table.integer('attempts').defaultTo(0);
    table.integer('max_attempts').defaultTo(3);
    table.timestamp('verified_at').nullable();
    table.timestamp('expires_at').notNullable();
    table.bigInteger('telegram_id').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.raw("CREATE INDEX idx_phone_verifications_user_id ON PhoneVerifications(user_id)");
  await knex.raw("CREATE INDEX idx_phone_verifications_phone ON PhoneVerifications(phone)");
  await knex.raw("CREATE INDEX idx_phone_verifications_telegram_id ON PhoneVerifications(telegram_id)");
  await knex.raw("CREATE INDEX idx_phone_verifications_expires_at ON PhoneVerifications(expires_at)");
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('PhoneVerifications');
};
