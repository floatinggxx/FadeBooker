module.exports = {
  development: {
    client: 'mssql',
    connection: {
      server: process.env.DB_SERVER || process.env.DB_HOST || 'fadebooker-server.database.windows.net',
      user: process.env.DB_USER || process.env.DB_USER || 'adminuser',
      password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
      database: process.env.DB_NAME || process.env.DB_DATABASE || 'FadeBooker_DB',
      options: {
        encrypt: true,
        trustServerCertificate: false,
        connectionTimeout: 30000,
        requestTimeout: 30000
      }
    }
  },
  production: {
    client: 'mssql',
    connection: {
      server: process.env.DB_SERVER || process.env.DB_HOST,
      user: process.env.DB_USER || process.env.DB_USER,
      password: process.env.DB_PASSWORD || process.env.DB_PASS,
      database: process.env.DB_NAME || process.env.DB_DATABASE || 'FadeBooker_DB',
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