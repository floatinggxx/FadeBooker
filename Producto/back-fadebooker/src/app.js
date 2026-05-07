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

app.use(express.json())

// Rutas de documentación ANTES del catch-all
const path = require('path');
const docsPath = path.resolve(__dirname, '..');
app.get('/docs/swagger.json', (req, res) => {
  res.sendFile(path.join(docsPath, 'swagger.json'));
});
app.get('/docs/openapi.yaml', (req, res) => {
  res.sendFile(path.join(docsPath, 'openapi.yaml'));
});

app.use('/api', routes)
// Manejo de rutas no encontradas (Fix para Express 5)
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});
module.exports = app