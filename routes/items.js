const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items');
const authenticateJWT = require('../middleware/auth');

router.get('/', authenticateJWT, itemsController.getAll);
router.get('/:id', authenticateJWT, itemsController.getSingle);
router.post('/', authenticateJWT, itemsController.createItem);
router.put('/:id', authenticateJWT, itemsController.updateItem);
router.delete('/:id', authenticateJWT, itemsController.deleteItem);

module.exports = router;
