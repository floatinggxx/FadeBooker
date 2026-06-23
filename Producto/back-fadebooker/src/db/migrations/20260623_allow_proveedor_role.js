exports.up = async function(knex) {
  // En SQL Server: eliminar la constraint existente CHK_Rol si existe
  await knex.raw("IF EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CHK_Rol') ALTER TABLE Usuario DROP CONSTRAINT CHK_Rol;")

  // Crear una nueva constraint que incluya 'Proveedor'
  await knex.raw("ALTER TABLE Usuario ADD CONSTRAINT CHK_Rol CHECK (rol IN ('Cliente','Barbero','Dueño','Administrador','Proveedor'));")
};

exports.down = async function(knex) {
  // Restaurar la constraint anterior (sin 'Proveedor')
  await knex.raw("IF EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CHK_Rol') ALTER TABLE Usuario DROP CONSTRAINT CHK_Rol;")
  await knex.raw("ALTER TABLE Usuario ADD CONSTRAINT CHK_Rol CHECK (rol IN ('Cliente','Barbero','Dueño','Administrador'));")
};
