const express = require('express');
const router = express.Router();
const loginHandler = require('./login');

// Endpoint de login
router.post('/login', loginHandler);

module.exports = router;
