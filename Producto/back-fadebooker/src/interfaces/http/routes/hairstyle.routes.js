/**
 * Hairstyle Routes
 * 
 * Define los endpoints relacionados con simulación de cortes de pelo
 * e integración con Cloudinary.
 */

const express = require('express');
const router = express.Router();
const HairstyleController = require('../controllers/hairstyle.controller');

/**
 * POST /api/hairstyle/signature
 * Genera firma para subidas seguras a Cloudinary
 */
router.post('/signature', HairstyleController.generateUploadSignature);

/**
 * POST /api/hairstyle/simulate
 * Genera simulación de corte de pelo sobre una imagen
 */
router.post('/simulate', HairstyleController.generateHairstyleSimulation);

module.exports = router;
