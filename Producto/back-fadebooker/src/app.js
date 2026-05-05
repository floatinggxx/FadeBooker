// Cargar variables de entorno al inicio
require('dotenv').config();

const express = require('express')
const cors = require('cors')
const routes = require('./interfaces/http/routes')

const app = express()

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(express.json())
app.use('/api', routes)

module.exports = app