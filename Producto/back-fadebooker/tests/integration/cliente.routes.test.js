/**
 * Tests de Integración - Endpoints de Cliente
 * Valida que los endpoints estén disponibles
 */

const request = require('supertest')
const express = require('express')

describe('Endpoints de Cliente', () => {
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
