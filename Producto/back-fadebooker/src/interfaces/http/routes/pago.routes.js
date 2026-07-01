const express = require('express')
const router = express.Router()
const PagoController = require('../controllers/pago.controller')
const validateRequest = require('../middlewares/validateRequest')
const { pagoCrearSchema, pagoCitaParamsSchema } = require('../../../infraestructure/schemas/pago.schema')

// Crear preferencia de pago para una cita
router.post('/crear', validateRequest({ body: pagoCrearSchema }), PagoController.crearPreferencia)

// Webhook de Mercado Pago (no requiere auth para que MP pueda acceder)
router.post('/webhook', PagoController.webhook)

// Endpoint de desarrollo para simular pagos completados (solo en no-producción)
router.post('/simular', PagoController.simular)

// Obtener pagos de una cita
router.get('/cita/:id_cita', validateRequest({ params: pagoCitaParamsSchema }), PagoController.obtenerPagosCita)

module.exports = router