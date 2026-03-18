const express = require('express');
const categoriaController = require('../controllers/categoriaController');
const { authenticate, requireRoles, optionalAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

// Public / Semi-Public endpoints
router.get('/', optionalAuth, categoriaController.getCategorias);

// Admin-only operations for catalog management
router.use(authenticate);
router.use(requireRoles(['ADMIN']));

router.post('/', upload.single('categoria_imagem'), categoriaController.createCategoria);
router.put('/:id', upload.single('categoria_imagem'), categoriaController.updateCategoria);
router.delete('/:id', categoriaController.deleteCategoria);

module.exports = router;
