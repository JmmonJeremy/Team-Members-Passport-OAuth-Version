const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/items', require('./items'));
router.use('/auth', require('./auth'));

module.exports = router;
