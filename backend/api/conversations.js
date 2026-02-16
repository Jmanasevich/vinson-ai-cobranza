const express = require('express');
const router = express.Router();
const { getDatabase } = require('../lib/database');
const { verifyToken } = require('../lib/auth');

// Middleware de autenticación
router.use(verifyToken);

// Obtener todas las conversaciones del usuario
router.get('/', (req, res) => {
  const db = getDatabase();
  const userId = req.user.id;
  
  db.all(
    'SELECT * FROM conversations WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener conversaciones' });
      }
      res.json(rows);
    }
  );
});

// Crear nueva conversación
router.post('/', (req, res) => {
  const db = getDatabase();
  const { client_id, transcript, analysis } = req.body;
  const userId = req.user.id;
  
  db.run(
    'INSERT INTO conversations (user_id, client_id, transcript, analysis) VALUES (?, ?, ?, ?)',
    [userId, client_id, transcript, analysis],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar conversación' });
      }
      res.json({ id: this.lastID, message: 'Conversación guardada exitosamente' });
    }
  );
});

// Obtener conversación por ID
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const userId = req.user.id;
  
  db.get(
    'SELECT * FROM conversations WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener conversación' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Conversación no encontrada' });
      }
      res.json(row);
    }
  );
});

module.exports = router;
