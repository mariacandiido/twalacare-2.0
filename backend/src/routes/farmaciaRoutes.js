const express = require('express');
const farmaciaController = require('../controllers/farmaciaController');
const { authenticate, requireRoles } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

// Restrict to Farmácia users only
router.use(authenticate);
router.use(requireRoles(['FARMACIA']));

// Settings
router.put('/perfil', farmaciaController.updatePerfil);

// Inventory
router.get('/medicamentos', farmaciaController.getMedicamentos);
router.post('/medicamentos', upload.single('medicamento_imagem'), farmaciaController.createMedicamento);
router.put('/medicamentos/:id', upload.single('medicamento_imagem'), farmaciaController.updateMedicamento);
router.delete('/medicamentos/:id', farmaciaController.deleteMedicamento);

// Flow of Orders
router.get('/pedidos', farmaciaController.getPedidosPendentes);
router.get('/historico-pedidos', farmaciaController.getHistoricoPedidos);
router.get('/pedidos/:id', farmaciaController.getPedidoDetalhes);
router.put('/pedidos/:id/status', farmaciaController.updatePedidoStatus);
router.post('/receitas/:id/verificar', farmaciaController.verificarReceita);

// Dispatch Logistics
router.get('/entregadores-disponiveis', farmaciaController.getEntregadores);
router.post('/pedidos/:id/atribuir-entregador', farmaciaController.atribuirEntregador);

module.exports = router;
