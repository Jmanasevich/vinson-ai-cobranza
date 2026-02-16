const express = require('express');
const router = express.Router();
const { getDatabase } = require('../lib/database');
const { verifyToken } = require('../lib/auth');

// Middleware de autenticación
router.use(verifyToken);

// Obtener todos los clientes
router.get('/clients', (req, res) => {
  const db = getDatabase();
  
  db.all(
    'SELECT * FROM clients ORDER BY created_at DESC',
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener clientes' });
      }
      res.json(rows);
    }
  );
});

// Obtener cliente por ID
router.get('/clients/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.get(
    'SELECT * FROM clients WHERE id = ?',
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener cliente' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json(row);
    }
  );
});

// Actualizar estado del cliente
router.patch('/clients/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const { estado } = req.body;
  
  db.run(
    'UPDATE clients SET estado = ? WHERE id = ?',
    [estado, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar cliente' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json({ message: 'Cliente actualizado exitosamente' });
    }
  );
});

module.exports = router;
