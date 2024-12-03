const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

router.use('/api-docs', require('./swagger'));
router.use('/items', require('./items'));
router.use('/auth', require('./auth'));

module.exports = router;
