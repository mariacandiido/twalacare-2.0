const express = require('express');
const publicController = require('../controllers/publicController');

const router = express.Router();

/**
 * Rotas públicas - Acessíveis sem autenticação
 */

router.get('/farmacias', publicController.getFarmacias);
router.get('/medicamentos', publicController.getMedicamentos);
router.get('/categorias', publicController.getCategorias);

module.exports = router;
