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

// Teardown: Cerrar conexiones después de todas las pruebas
afterAll(async () => {
  // Cerrar conexiones de base de datos si existen
  try {
    // Dar tiempo para que se resuelvan las conexiones pendientes
    await new Promise(resolve => setTimeout(resolve, 100))
  } catch (error) {
    console.error('Error durante teardown:', error)
  }
})

// Configurar para detectar memory leaks
if (typeof jest !== 'undefined') {
  jest.setTimeout(30000) // Timeout más largo para evitar false positives
}
