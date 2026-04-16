/**
 * Tests de Integración - Endpoints de Cliente
 * ⚠️  SKIPPED: Requieren servidor Express en ejecución + BD disponible
 * TODO: Configurar servidor de test o mockear servicios de BD
 */

const request = require('supertest')
const express = require('express')

describe.skip('Endpoints de Cliente', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use(express.json())
    app.use('/api/clientes', require('../../src/interfaces/http/routes/cliente.routes'))
    jest.setTimeout(3000)
  })

  test('GET /api/clientes debe existir', async () => {
    const response = await request(app)
      .get('/api/clientes')
      .timeout(2000)

    expect(response.status).not.toBe(404)
  })

  test('POST /api/clientes debe existir', async () => {
    const response = await request(app)
      .post('/api/clientes')
      .timeout(2000)
      .send({ email: 'cliente@example.com' })

    expect(response.status).not.toBe(404)
  })

  test('GET /api/clientes/:id debe existir', async () => {
    const response = await request(app)
      .get('/api/clientes/1')
      .timeout(2000)

    expect(response.status).not.toBe(404)
  })
})
