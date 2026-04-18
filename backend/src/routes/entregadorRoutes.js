const express = require('express');
const entregadorController = require('../controllers/entregadorController');
const { authenticate, requireRoles } = require('../middlewares/auth');

const router = express.Router();

// Restrict to Delivery Couriers only
router.use(authenticate);
router.use(requireRoles(['ENTREGADOR']));

// Account Management
router.put('/perfil', entregadorController.updatePerfil);
router.put('/disponibilidade', entregadorController.updateDisponibilidade);

// Routes & Missions
router.get('/pedidos-atribuidos', entregadorController.getPedidosAtribuidos);
router.get('/historico', entregadorController.getHistorico);

// Operations 
router.put('/pedidos/:id/iniciar', entregadorController.iniciarEntrega);
router.put('/pedidos/:id/status', entregadorController.updateEntregaStatus);
router.put('/pedidos/:id/concluir', entregadorController.concluirEntrega);

module.exports = router;
