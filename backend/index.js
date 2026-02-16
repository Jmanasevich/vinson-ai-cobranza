require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./api/auth');
const conversationsRoutes = require('./api/conversations');
const catalogsRoutes = require('./api/catalogs');
const scriptsRoutes = require('./api/scripts');
const { initDatabase } = require('./lib/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationsRoutes);
app.use('/api/catalogs', catalogsRoutes);
app.use('/api/scripts', scriptsRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

// Inicializar base de datos y arrancar servidor
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  });
