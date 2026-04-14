module.exports = {
  development: {
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