const db = require('../src/db/knex')

async function crearTabla() {
  try {
    const existe = await db.schema.hasTable('BloqueHorario')
    if (existe) {
      console.log('La tabla BloqueHorario ya existe. No se realizan cambios.')
      process.exit(0)
    }

    console.log('Creando tabla BloqueHorario...')

    const sql = `
    CREATE TABLE BloqueHorario (
      id_bloque INT IDENTITY(1,1) PRIMARY KEY,
      id_barbero INT NOT NULL,
      fecha_hora_inicio DATETIME2 NOT NULL,
      fecha_hora_fin DATETIME2 NOT NULL,
      motivo NVARCHAR(255) NULL,
      estado BIT NOT NULL DEFAULT 1,
      createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
      updatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
      CONSTRAINT CK_BloqueHorario_Rango CHECK (fecha_hora_inicio < fecha_hora_fin)
    );

    CREATE INDEX IX_BloqueHorario_Barbero ON BloqueHorario (id_barbero, fecha_hora_inicio) WHERE estado = 1;
    `

    await db.raw(sql)
    console.log('Tabla BloqueHorario creada correctamente.')
    process.exit(0)
  } catch (err) {
    console.error('Error creando la tabla BloqueHorario:', err.message || err)
    process.exit(1)
  }
}

crearTabla()
