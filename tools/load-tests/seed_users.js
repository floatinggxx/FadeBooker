/**
 * Simple seeder to create many test users directly in the DB using Knex.
 * Usage: node seed_users.js --count=1000
 * Requires env vars: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
 */
const bcrypt = require('bcrypt');
const createKnex = (dbName) => require('knex')({
  client: 'mssql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    server: process.env.DB_HOST || process.env.DB_SERVER || 'localhost',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'Your_password123',
    database: dbName || process.env.DB_NAME || 'FadeBooker',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 1433,
    options: { enableArithAbort: true, encrypt: false, trustServerCertificate: true }
  },
  pool: { min: 0, max: 10 }
});

let knex = createKnex(process.env.DB_NAME || process.env.DB_DATABASE || 'FadeBooker');

const argv = require('minimist')(process.argv.slice(2));
const count = Number(argv.count) || 1000;

async function run() {
  console.log('Seeding', count, 'users...');

  // Verificar conectividad antes de comenzar a insertar
  try {
    await knex.raw('SELECT 1')
    console.log('✅ DB reachable, starting inserts')
  } catch (err) {
    const msg = String(err.message || err).toLowerCase();
    console.error('⚠️ DB initial check failed:', msg);
    // If failure is because the explicit DB doesn't exist, try creating it via master
    if (msg.includes('failed to open the explicitly specified database') || msg.includes('cannot open database')) {
      const targetDb = process.env.DB_NAME || process.env.DB_DATABASE || 'FadeBooker';
      console.log(`🔧 Intentando crear la base de datos '${targetDb}' conectando a master...`);
      const knexMaster = createKnex('master');
      try {
        await knexMaster.raw(`IF DB_ID(N'${targetDb}') IS NULL CREATE DATABASE [${targetDb}];`);
        console.log(`✅ Base de datos '${targetDb}' creada o ya existente.`);
        await knexMaster.destroy();
        await knex.destroy();
        knex = createKnex(targetDb);
        await knex.raw('SELECT 1');
        console.log('✅ Reconectado al target DB, empezando inserts');
      } catch (createErr) {
        console.error('❌ Error creando la BD:', createErr.message || createErr);
        await knexMaster.destroy();
        await knex.destroy();
        process.exit(2);
      }
    } else {
      console.error('❌ Cannot reach DB:', err.message || err);
      await knex.destroy();
      process.exit(2);
    }
  }
  // Insert in small batches inside a transaction for reliability
  const batchSize = 100;
  for (let start = 1; start <= count; start += batchSize) {
    const end = Math.min(start + batchSize - 1, count);
    const batch = [];
    for (let i = start; i <= end; i++) {
      // By default include a unique suffix to avoid duplicates on repeated runs.
      // If FIXED_EMAILS=true is set, produce deterministic emails without the timestamp
      const uniqueSuffix = process.env.FIXED_EMAILS === 'true' ? '' : `+${Date.now()}_${i}`;
      const email = process.env.FIXED_EMAILS === 'true'
        ? `loadtest+user${i}@example.com`
        : `loadtest+user${i}${uniqueSuffix}@example.com`;
      const password = 'Secreto123';
      const hash = await bcrypt.hash(password, 10);
      batch.push({
        nombre: 'Load',
        apellido: `User${i}`,
        email,
        telefono: '999000000',
        contrasena: hash,
        rol: 'Cliente',
        estado: 1
      });
    }
    // attempt batch insert with retries
    const maxAttempts = 4;
    let attempt = 0;
    let succeeded = false;
    while (!succeeded && attempt < maxAttempts) {
      attempt++;
      try {
        await knex.transaction(async trx => {
          // use insert with explicit column names to avoid schema mismatch
          await trx.insert(batch).into('Usuario');
        });
        succeeded = true;
      } catch (err) {
        // If this is an AggregateError from tedious, try to log inner errors
        if (err && err.innerErrors) {
          try {
            const util = require('util');
            console.error('  AggregateError.innerErrors:', util.inspect(err.innerErrors, { depth: 3 }));
          } catch (e) {
            console.error('  (failed to inspect innerErrors)', e && e.message);
          }
        }
        // If batch fails, fallback to individual inserts to isolate failing row(s)
        if (attempt === 1) {
          console.warn(`Batch insert failed for ${start}-${end}, falling back to single-row inserts to isolate errors.`);
          for (let j = 0; j < batch.length; j++) {
            const row = batch[j];
            try {
              await knex('Usuario').insert(row);
            } catch (singleErr) {
              console.error(`  Single insert failed for email=${row.email}:`, singleErr && (singleErr.message || singleErr));
              if (singleErr && singleErr.code) console.error('    SQL code:', singleErr.code);
              if (singleErr && singleErr.stack) console.error(singleErr.stack.split('\n').slice(0,3).join('\n'));
            }
          }
          // after trying singles, break the retry loop for this batch
          succeeded = true;
          break;
        }
        const msg = err && (err.message || err).toString();
        if (msg.toLowerCase().includes('unique') || msg.toLowerCase().includes('duplicate')) {
          console.warn(`Some rows in batch ${start}-${end} were duplicates (attempt ${attempt}). Treating as OK.`);
          succeeded = true;
          break;
        }
        console.error(`Batch insert error ${start}-${end} (attempt ${attempt}/${maxAttempts}):`, msg);
        if (err.code) console.error('  SQL error code:', err.code);
        if (err.stack) console.error(err.stack.split('\n').slice(0,3).join('\n'));
        // exponential backoff before retrying
        const backoff = Math.min(2000, 200 * Math.pow(2, attempt));
        console.log(`  Esperando ${backoff}ms antes del reintento (${attempt+1}/${maxAttempts})...`);
        await new Promise(r => setTimeout(r, backoff));
      }
    }
    if (!succeeded) console.error(`Failed to insert batch ${start}-${end} after ${maxAttempts} attempts`);
    console.log('Inserted up to', end);
  }
  
  console.log('Done seeding.');
  await knex.destroy();
}

// handle signals and ensure knex is destroyed
process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing DB connections');
  try { await knex.destroy(); } catch (e) {}
  process.exit(130);
});
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing DB connections');
  try { await knex.destroy(); } catch (e) {}
  process.exit(143);
});

run().catch(async err => {
  console.error('Unhandled error in seeder:', err && (err.stack || err));
  try { await knex.destroy(); } catch (e) {}
  process.exit(1);
});
