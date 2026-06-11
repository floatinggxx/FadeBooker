const knex = require('knex');

module.exports = function createInMemoryDb() {
  return knex({
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true
  });
}
