/**
 * Setup global para Jest
 * Se ejecuta una vez antes de las pruebas
 */

// Configurar timeout global
jest.setTimeout(10000)

// Mock de console si necesario (opcional)
// global.console.log = jest.fn()

// Variables globales de test
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = 'test'
