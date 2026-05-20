// Cargar variables de entorno al inicio
require('dotenv').config();

const express = require('express')
const cors = require('cors')
const routes = require('./interfaces/http/routes')
const errorHandler = require('./interfaces/http/middlewares/errorHandler')

const app = express()

// Permitir solicitudes de Power Automate y otros servicios externos
const corsOptions = {
  origin: '*', // Permitir todos los orígenes para la integración con Power Platform
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))

app.use(express.json())

// Logger simple para debug
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rutas de documentación ANTES del catch-all
const path = require('path');
const docsPath = path.resolve(__dirname, '..');
app.get('/docs/swagger.json', (req, res) => {
  res.sendFile(path.join(docsPath, 'swagger.json'));
});
app.get('/docs/openapi.yaml', (req, res) => {
  res.sendFile(path.join(docsPath, 'openapi.yaml'));
});

// Interfaz visual de Swagger
app.get('/api-docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>FadeBooker API Docs</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" charset="UTF-8"></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: "/docs/swagger.json",
            dom_id: '#swagger-ui',
          });
        };
      </script>
    </body>
    </html>
  `);
});

app.use('/api', routes)

// Middleware de manejo de errores global
app.use(errorHandler)

// Manejo de rutas no encontradas (Fix para Express 5)
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});
module.exports = app