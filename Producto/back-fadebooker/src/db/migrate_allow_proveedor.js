const db = require('./knex');

async function run() {
  try {
    console.log('Applying migration: allow Proveedor in CHK_Rol');
    await db.raw("IF EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CHK_Rol') ALTER TABLE Usuario DROP CONSTRAINT CHK_Rol;");
    await db.raw("ALTER TABLE Usuario ADD CONSTRAINT CHK_Rol CHECK (rol IN ('Cliente','Barbero','Dueño','Administrador','Proveedor'));");
    console.log('Migration applied successfully');
  } catch (err) {
    console.error('Migration failed:', err && err.message ? err.message : err);
    process.exitCode = 1;
  } finally {
    // Close connection
    if (db && db.destroy) await db.destroy();
  }
}

run();
