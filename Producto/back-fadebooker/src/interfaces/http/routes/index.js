const express = require('express')
const router = express.Router()

const usuarioRoutes = require('./usuario.routes')
const citaRoutes = require('./cita.routes')
const clienteRoutes = require('./cliente.routes')
const barberoRoutes = require('./barbero.routes')
const servicioRoutes = require('./servicio.routes')
const hairstyleRoutes = require('./hairstyle.routes')
const reporteRoutes = require('./reporte.routes')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    message: 'FadeBooker API is running'
  })
})

router.use('/usuarios', usuarioRoutes)
router.use('/citas', citaRoutes)
router.use('/clientes', clienteRoutes)
router.use('/barberos', barberoRoutes)
router.use('/servicios', servicioRoutes)
router.use('/hairstyle', hairstyleRoutes)
router.use('/reportes', reporteRoutes)

module.exports = router