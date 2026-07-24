const db = require('../config/db');

const crearEmergencia = async (req, res) => {
  const { usr_paciente_id, emg_latitud, emg_longitud } = req.body;

  if (!usr_paciente_id || !emg_latitud || !emg_longitud) {
    return res.status(400).json({ error: 'Faltan datos obligatorios para la emergencia' });
  }

  try {
    const query = 'INSERT INTO emergencias (usr_paciente_id, emg_latitud, emg_longitud, emg_estado) VALUES (?, ?, ?, "pendiente")';
    
    // mysql2 con promise() retorna un arreglo [result, fields]
    const [result] = await db.query(query, [usr_paciente_id, emg_latitud, emg_longitud]);

    return res.status(201).json({ 
      success: true, 
      mensaje: '¡Alerta SOS registrada con éxito!', 
      emergencia_id: result.insertId 
    });
  } catch (err) {
    console.error('Error al registrar la emergencia SOS:', err);
    return res.status(500).json({ error: 'Error interno al registrar la emergencia' });
  }
};

module.exports = {
  crearEmergencia
};