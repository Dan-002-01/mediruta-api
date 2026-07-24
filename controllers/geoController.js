const db = require('../config/db');

// 1. Guardar la ubicación de la ambulancia
exports.actualizarUbicacion = async (req, res) => {
  // Aceptamos 'lat' y 'lng' (enviados por Ionic) o 'ub_latitud'/'ub_longitud' por compatibilidad
  const { amb_id, lat, lng, ub_latitud, ub_longitud } = req.body;

  const latitude = lat !== undefined ? lat : ub_latitud;
  const longitude = lng !== undefined ? lng : ub_longitud;

  if (!amb_id || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (amb_id, lat, lng)' });
  }

  try {
    await db.query(
      'INSERT INTO ubicaciones_ambulancias (amb_id, ub_latitud, ub_longitud) VALUES (?, ?, ?)',
      [amb_id, latitude, longitude]
    );
    res.json({ OK: true, mensaje: 'Coordenadas registradas con éxito' });
  } catch (error) {
    console.error('Error al insertar ubicación:', error);
    res.status(500).json({ error: 'Error al insertar la ubicación en la base de datos' });
  }
};

// 2. Obtener la última posición para el mapa del paciente
exports.obtenerUbicacionActual = async (req, res) => {
  const { amb_id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT ub_latitud AS lat, ub_longitud AS lng, ub_fecha FROM ubicaciones_ambulancias WHERE amb_id = ? ORDER BY ub_fecha DESC LIMIT 1',
      [amb_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No hay registros geográficos para esta ambulancia' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al consultar ubicación:', error);
    res.status(500).json({ error: 'Error al consultar la ubicación' });
  }
};