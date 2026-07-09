module.exports = {
  development: (function() {
    // Default dev connection values
    const server = process.env.DB_SERVER || process.env.DB_HOST || 'fadebooker-server.database.windows.net';
    const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined;
    const user = process.env.DB_USER || 'adminuser';
    const password = process.env.DB_PASSWORD || process.env.DB_PASS || '';
    const database = process.env.DB_DATABASE || process.env.DB_NAME || 'FadeBooker_DB';

    // If connecting to localhost or 127.0.0.1 for local testing, disable encrypt and trust server cert
    const isLocal = server === '127.0.0.1' || server === 'localhost' || server.startsWith('127.') || process.env.FORCE_LOCAL_DB === 'true';

    return {
      client: 'mssql',
      connection: {
        server,
        port,
        user,
        password,
        database,
        options: {
          encrypt: !isLocal,
          trustServerCertificate: !!isLocal,
          connectionTimeout: 30000,
          requestTimeout: 30000
        }
      }
    };
  })(),
  production: {
    client: 'mssql',
    connection: {
      server: process.env.DB_SERVER || process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      user: process.env.DB_USER || process.env.DB_USER,
      password: process.env.DB_PASSWORD || process.env.DB_PASS,
      database: process.env.DB_DATABASE || process.env.DB_NAME || 'FadeBooker_DB',
      options: {
        encrypt: true,
        trustServerCertificate: false,
        connectionTimeout: 30000,
        requestTimeout: 30000
      }
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  local: {
    client: 'mssql',
    connection: {
      host: '127.0.0.1',
      user: 'sa',
      password: 'YourStrong@Pass123',
      database: 'fadebooker',
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    }
  }
  ,
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, done) => {
        // enable foreign keys on sqlite
        conn.run('PRAGMA foreign_keys = ON', done);
      }
    }
  }
}