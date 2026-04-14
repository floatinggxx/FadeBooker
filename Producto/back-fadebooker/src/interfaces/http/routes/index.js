const express = require('express')
const router = express.Router()

const usuarioRoutes = require('./usuario.routes')
const citaRoutes = require('./cita.routes')
const clienteRoutes = require('./cliente.routes')
const barberoRoutes = require('./barbero.routes')
const servicioRoutes = require('./servicio.routes')

router.use('/usuarios', usuarioRoutes)
router.use('/citas', citaRoutes)
router.use('/clientes', clienteRoutes)
router.use('/barberos', barberoRoutes)
router.use('/servicios', servicioRoutes)

module.exports = router