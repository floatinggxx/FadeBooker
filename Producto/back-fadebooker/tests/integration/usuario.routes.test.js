/**
 * Tests de Integración - Endpoints de Usuario
 * Valida que los endpoints de usuario sean accesibles
 */

const request = require('supertest')
const express = require('express')

describe('Endpoints de Usuario', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use(express.json())
    app.use('/api/usuarios', require('../../src/interfaces/http/routes/usuario.routes'))
    jest.setTimeout(3000)
  })

  test('POST /api/usuarios/register debe existir y ser llamable', async () => {
    const response = await request(app)
      .post('/api/usuarios/register')
      .timeout(2000)
      .send({
        email: 'test@example.com',
        nombre: 'Test'
      })

    expect(response.status).not.toBe(404)
  })

  test('POST /api/usuarios/login debe existir y ser llamable', async () => {
    const response = await request(app)
      .post('/api/usuarios/login')
      .timeout(2000)
      .send({
        email: 'test@example.com',
        password: 'test123'
      })

    expect(response.status).not.toBe(404)
  })
})
