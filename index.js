const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar rutas necesarias
const geoRoutes = require('./routes/geoRoutes');
const authRoutes = require('./routes/authRoutes'); 
const emergenciaRoutes = require('./routes/emergenciaRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Enlazar rutas
app.use('/api/geolocalizacion', geoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/emergencias', emergenciaRoutes); // Aquí se expone /api/emergencias



// Ruta base
app.get('/', (req, res) => {
  res.send('🚑 API de MediRuta / SOS Medical activa y respondiendo.');
});

// Levantar servidor

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});