const express = require('express');
const router = express.Router();
const geoController = require('../controllers/geoController');

router.put('/actualizar', geoController.actualizarUbicacion);
router.get('/monitorear/:amb_id', geoController.obtenerUbicacionActual);

module.exports = router;