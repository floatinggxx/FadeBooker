const express = require('express')
const router = express.Router()

const usuarioRoutes = require('./usuario.routes')
const citaRoutes = require('./cita.routes')
const clienteRoutes = require('./cliente.routes')
const barberoRoutes = require('./barbero.routes')
const servicioRoutes = require('./servicio.routes')
const hairstyleRoutes = require('./hairstyle.routes')

router.use('/usuarios', usuarioRoutes)
router.use('/citas', citaRoutes)
router.use('/clientes', clienteRoutes)
router.use('/barberos', barberoRoutes)
router.use('/servicios', servicioRoutes)
router.use('/hairstyle', hairstyleRoutes)

module.exports = router