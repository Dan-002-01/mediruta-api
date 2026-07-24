const db = require('../config/db');

// 1. Guardar la ubicación de la ambulancia
exports.actualizarUbicacion = async (req, res) => {
  const { amb_id, ub_latitud, ub_longitud } = req.body;

  if (!amb_id || !ub_latitud || !ub_longitud) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (amb_id, ub_latitud, ub_longitud)' });
  }

  try {
    await db.query(
      'INSERT INTO ubicaciones_ambulancias (amb_id, ub_latitud, ub_longitud) VALUES (?, ?, ?)',
      [amb_id, ub_latitud, ub_longitud]
    );
    res.json({ OK: true, mensaje: 'Coordenadas registradas con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar la ubicación en la base de datos' });
  }
};

// 2. Obtener la última posición para el mapa del paciente
exports.obtenerUbicacionActual = async (req, res) => {
  const { amb_id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT ub_latitud, ub_longitud, ub_fecha FROM ubicaciones_ambulancias WHERE amb_id = ? ORDER BY ub_fecha DESC LIMIT 1',
      [amb_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No hay registros geográficos para esta ambulancia' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar la ubicación' });
  }
};