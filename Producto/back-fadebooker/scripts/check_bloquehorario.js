const db = require('../../src/db/knex');

(async () => {
  try {
    console.log('Buscando tabla BloqueHorario...');
    const result = await db.raw("SELECT schema_name(schema_id) as schema_name, name FROM sys.tables WHERE name = 'BloqueHorario'");
    
    if (result.recordset && result.recordset.length > 0) {
      console.log('✅ Tabla BloqueHorario encontrada:');
      console.log(JSON.stringify(result.recordset, null, 2));
    } else {
      console.log('❌ Tabla BloqueHorario NO existe en la base de datos');
    }
    
    console.log('\n\nTodas las tablas en la BD:');
    const allTables = await db.raw("SELECT schema_name(schema_id) as schema_name, name FROM sys.tables ORDER BY name");
    console.log(JSON.stringify(allTables.recordset.map(t => `${t.schema_name}.${t.name}`), null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message || err);
    process.exit(1);
  }
})();
