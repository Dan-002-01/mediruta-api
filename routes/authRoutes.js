const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Ojo: subimos un nivel con '../' para encontrar db.js

const router = express.Router();

// Clave secreta para firmar los tokens
const SECRET_KEY = process.env.JWT_SECRET || 'mi_clave_ultrasecreta_123';

router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: 'Faltan credenciales' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT usr_id, usr_nombre, usr_rol, usr_password FROM usuarios WHERE usr_correo = ?',
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = rows[0];

    if (password !== usuario.usr_password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        id: usuario.usr_id,
        rol: usuario.usr_rol,
        nombre: usuario.usr_nombre
      },
      SECRET_KEY,
      { expiresIn: '8h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token: token,
      usuario: {
        id: usuario.usr_id,
        nombre: usuario.usr_nombre,
        rol: usuario.usr_rol
      }
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;