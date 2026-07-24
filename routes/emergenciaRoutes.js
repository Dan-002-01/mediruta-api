const express = require('express');
const router = express.Router();
const { 
    crearEmergencia, 
    obtenerEmergenciaActiva, 
    iniciarRuta,
    finalizarEmergencia 
} = require('../controllers/emergenciaController');

// Ruta POST para que el paciente cree una emergencia y se le asigne ambulancia
router.post('/', crearEmergencia);

// Ruta GET para que el chofer consulte si tiene una emergencia activa
router.get('/activa/:amb_id', obtenerEmergenciaActiva);

// Ruta PUT para que el paramédico inicie la ruta (cambia estado a 'en_camino' y ambulancia a 'en_emergencia')
router.put('/:emg_id/iniciar-ruta', iniciarRuta);

// Ruta PUT para finalizar la emergencia y liberar la ambulancia a 'disponible'
router.put('/:emg_id/finalizar', finalizarEmergencia);

module.exports = router;