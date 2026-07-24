const pool = require('../config/db');

// 1. Crear la emergencia y asignar una ambulancia disponible automáticamente
const crearEmergencia = async (req, res) => {
    const { usr_paciente_id, emg_latitud, emg_longitud } = req.body;

    if (!usr_paciente_id || !emg_latitud || !emg_longitud) {
        return res.status(400).json({
            error: 'Faltan datos obligatorios para la emergencia'
        });
    }

    try {
        // Buscar una ambulancia disponible
        const [ambulancias] = await pool.query(
            "SELECT * FROM ambulancias WHERE amb_estado = 'disponible' LIMIT 1"
        );

        if (ambulancias.length === 0) {
            return res.status(404).json({
                mensaje: 'No hay ambulancias disponibles en este momento'
            });
        }

        const ambulanciaAsignada = ambulancias[0];

        // Registrar la emergencia con estado pendiente y la ambulancia asignada
        const [resultadoEmergencia] = await pool.query(
            `INSERT INTO emergencias
            (usr_paciente_id, amb_id, emg_latitud, emg_longitud, emg_estado, emg_fecha)
            VALUES (?, ?, ?, ?, 'pendiente', NOW())`,
            [
                usr_paciente_id,
                ambulanciaAsignada.amb_id,
                emg_latitud,
                emg_longitud
            ]
        );

        // Cambiar estado de la ambulancia a en_emergencia
        await pool.query(
            "UPDATE ambulancias SET amb_estado = 'en_emergencia' WHERE amb_id = ?",
            [ambulanciaAsignada.amb_id]
        );

        return res.status(201).json({
            success: true,
            mensaje: '¡Alerta SOS registrada y ambulancia asignada con éxito!',
            emergencia_id: resultadoEmergencia.insertId,
            ambulancia: ambulanciaAsignada
        });

    } catch (error) {
        console.error('Error al procesar la emergencia:', error);
        return res.status(500).json({
            error: 'Error en el servidor al procesar la emergencia'
        });
    }
};

// 2. Consultar la emergencia activa para la ambulancia (detecta pendiente o en camino)
const obtenerEmergenciaActiva = async (req, res) => {
    const { amb_id } = req.params;

    console.log(`🔍 Buscando emergencia activa para la ambulancia ${amb_id}`);

    try {
        const query = `
            SELECT
                e.*,
                u.usr_nombre AS paciente_nombre,
                u.usr_correo AS paciente_correo
            FROM emergencias e
            INNER JOIN usuarios u
                ON e.usr_paciente_id = u.usr_id
            WHERE
                e.amb_id = ?
                AND (e.emg_estado = 'pendiente' OR e.emg_estado = 'en_camino')
            LIMIT 1
        `;

        const [rows] = await pool.query(query, [amb_id]);

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: 'No hay emergencias activas para esta ambulancia'
            });
        }

        return res.json(rows[0]);

    } catch (error) {
        console.error('Error al obtener emergencia activa:', error);
        return res.status(500).json({
            error: 'Error en el servidor'
        });
    }
};

// 3. NUEVO: Iniciar ruta (Cuando el paramédico presiona play/iniciar ruta en Ionic)
const iniciarRuta = async (req, res) => {
    const { emg_id } = req.params;
    const { amb_id } = req.body;

    try {
        // Actualizar la emergencia a 'en_camino'
        await pool.query(
            "UPDATE emergencias SET emg_estado = 'en_camino' WHERE emg_id = ?",
            [emg_id]
        );

        // Asegurar que la ambulancia esté marcada como 'en_emergencia'
        if (amb_id) {
            await pool.query(
                "UPDATE ambulancias SET amb_estado = 'en_emergencia' WHERE amb_id = ?",
                [amb_id]
            );
        }

        return res.json({
            success: true,
            mensaje: 'Ruta iniciada correctamente, estado actualizado a en_camino'
        });

    } catch (error) {
        console.error('Error al iniciar la ruta:', error);
        return res.status(500).json({
            error: 'Error en el servidor al iniciar la ruta'
        });
    }
};

// 4. Finalizar la emergencia
const finalizarEmergencia = async (req, res) => {
    const { emg_id } = req.params;
    const { amb_id } = req.body;

    try {
        // Cambiar estado de la emergencia a 'atendida'
        await pool.query(
            "UPDATE emergencias SET emg_estado = 'atendida' WHERE emg_id = ?",
            [emg_id]
        );

        // Liberar ambulancia a 'disponible'
        if (amb_id) {
            await pool.query(
                "UPDATE ambulancias SET amb_estado = 'disponible' WHERE amb_id = ?",
                [amb_id]
            );
        }

        return res.json({
            success: true,
            mensaje: 'Emergencia atendida y ambulancia liberada correctamente'
        });

    } catch (error) {
        console.error('Error al finalizar la emergencia:', error);
        return res.status(500).json({
            error: 'Error en el servidor al finalizar la emergencia'
        });
    }
};

module.exports = {
    crearEmergencia,
    obtenerEmergenciaActiva,
    iniciarRuta,
    finalizarEmergencia
};