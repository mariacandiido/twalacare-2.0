/**
 * Rotas de utilizadores: /api/users
 */
const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, requireRoles } = require('../middlewares/auth');

const router = express.Router();

router.get('/me', authenticate, userController.getMe);
router.patch('/me', authenticate, userController.updateMe);

router.get('/', authenticate, requireRoles(['admin']), userController.listUsers);
router.get('/:id', authenticate, requireRoles(['admin']), userController.getById);

module.exports = router;
