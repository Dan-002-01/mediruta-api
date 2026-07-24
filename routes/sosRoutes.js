const express = require('express');
const router = express.Router();
const { crearEmergencia } = require('../controllers/sosController');

// Ruta POST para recibir el botón SOS
router.post('/emergencias', crearEmergencia);

module.exports = router;