/**
 * Agregação de todas as rotas unificada por Painel de Acesso.
 */
const express = require('express');
const authRoutes = require('./authRoutes');
const clienteRoutes = require('./clienteRoutes');
const farmaciaRoutes = require('./farmaciaRoutes');
const entregadorRoutes = require('./entregadorRoutes');
const notificacaoRoutes = require('./notificacaoRoutes');
const categoriaRoutes = require('./categoriaRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cliente', clienteRoutes);
router.use('/farmacia', farmaciaRoutes);
router.use('/entregador', entregadorRoutes);
router.use('/notificacoes', notificacaoRoutes);
router.use('/categorias', categoriaRoutes);

module.exports = router;
