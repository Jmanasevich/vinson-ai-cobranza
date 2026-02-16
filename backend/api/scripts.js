const express = require('express');
const router = express.Router();
const { verifyToken } = require('../lib/auth');
const { generateScript } = require('../lib/gemini');

// Middleware de autenticación
router.use(verifyToken);

// Generar script de cobranza con IA
router.post('/generate', async (req, res) => {
  try {
    const { clientData, context } = req.body;
    
    if (!clientData) {
      return res.status(400).json({ error: 'Datos del cliente requeridos' });
    }
    
    const script = await generateScript(clientData, context);
    res.json({ script });
  } catch (error) {
    console.error('Error al generar script:', error);
    res.status(500).json({ error: 'Error al generar script de cobranza' });
  }
});

module.exports = router;
