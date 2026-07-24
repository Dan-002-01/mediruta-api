const express = require('express');
const router = express.Router();
const { 
    crearEmergencia, 
    obtenerEmergenciaActiva, 
    finalizarEmergencia 
} = require('../controllers/emergenciaController');

// Ruta POST para que el paciente cree una emergencia y se le asigne ambulancia
router.post('/emergencias', crearEmergencia);

// Ruta GET para que el chofer consulte si tiene una emergencia activa (usando el ID de su ambulancia)
router.get('/emergencias/activa/:amb_id', obtenerEmergenciaActiva);

// Ruta PUT para finalizar la emergencia y liberar la ambulancia a 'disponible'
router.put('/emergencias/:emg_id/finalizar', finalizarEmergencia);

module.exports = router;