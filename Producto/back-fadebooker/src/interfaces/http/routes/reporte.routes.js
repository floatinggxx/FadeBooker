const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/ReporteController');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/citas', authMiddleware, ReporteController.getReporteCitas);

module.exports = router;
