// Cargar variables de entorno al inicio
require('dotenv').config();

const express = require('express')
const routes = require('./interfaces/http/routes')

const app = express()

app.use(express.json())
app.use('/api', routes)

module.exports = app