module.exports = {
  // Mostrar información detallada sobre las pruebas
  testEnvironment: 'node',
  verbose: true,

  // Rutas de pruebas
  testMatch: [
    '**/tests/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Configuración de cobertura
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/app.js'
  ],

  // Umbrales de cobertura (mínimo requerido)
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 5,
      statements: 5
    }
  },

  // Transformadores (si usaras TypeScript en el futuro)
  transform: {},

  // Extensiones de módulos
  moduleFileExtensions: ['js', 'json'],

  // Configuración de timeout
  testTimeout: 10000,

  // Mostrar avisos
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'json'],
  coverageDirectory: 'coverage',

  // Setup/Teardown
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Ignorar ciertos directorios
  testPathIgnorePatterns: ['/node_modules/', '/build/']
}
