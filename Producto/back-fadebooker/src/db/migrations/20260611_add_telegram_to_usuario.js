exports.up = async function(knex) {
  await knex.schema.alterTable('Usuario', table => {
    table.bigInteger('telegram_id').nullable();
    table.boolean('phone_verified').notNullable().defaultTo(false);
    table.string('verified_phone', 20).nullable();
  });

  await knex.raw('CREATE INDEX idx_usuario_telegram_id ON Usuario(telegram_id)');
  await knex.raw('CREATE INDEX idx_usuario_phone_verified ON Usuario(phone_verified)');
  await knex.raw('CREATE INDEX idx_usuario_verified_phone ON Usuario(verified_phone)');
};

exports.down = async function(knex) {
  await knex.schema.alterTable('Usuario', table => {
    table.dropColumn('telegram_id');
    table.dropColumn('phone_verified');
    table.dropColumn('verified_phone');
  });
};
