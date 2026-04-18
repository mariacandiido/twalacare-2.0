const express = require('express');
const clienteController = require('../controllers/clienteController');
const { authenticate, requireRoles } = require('../middlewares/auth');
const upload = require('../middlewares/upload'); // for prescriptions

const router = express.Router();

// Allowed only for users with role 'CLIENTE'
router.use(authenticate);
router.use(requireRoles(['CLIENTE']));

// Browsing
router.get('/farmacias', clienteController.getFarmacias);
router.get('/medicamentos', clienteController.getMedicamentos);
router.get('/medicamentos/search', clienteController.getMedicamentos); // Uses query ?q=

// Addresses
router.get('/enderecos', clienteController.getEnderecos);
router.post('/enderecos', clienteController.createEndereco);

// Orders & Checkout
router.post('/pedidos', clienteController.createPedido);
router.get('/pedidos/historico', clienteController.getHistoricoPedidos);
router.get('/pedidos/:id/status', clienteController.getEstatusPedido);
router.post('/pedidos/:id/receita', upload.single('receita_arquivo'), clienteController.uploadReceita);

// Reviews
router.post('/avaliacoes', clienteController.createAvaliacao);

module.exports = router;
