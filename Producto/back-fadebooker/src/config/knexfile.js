module.exports = {
  development: {
    client: 'mssql',
    connection: {
      server: process.env.DB_SERVER || 'fadebooker-server.database.windows.net',
      user: process.env.DB_USER || 'adminuser',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'FadeBooker_DB',
      options: {
        encrypt: true,
        trustServerCertificate: false,
        connectionTimeout: 30000,
        requestTimeout: 30000
      }
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
}