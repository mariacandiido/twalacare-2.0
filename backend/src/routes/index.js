/**
 * Agregação de todas as rotas unificada por Painel de Acesso.
 */
const express = require("express");
const authRoutes = require("./authRoutes");
const clienteRoutes = require("./clienteRoutes");
const farmaciaRoutes = require("./farmaciaRoutes");
const entregadorRoutes = require("./entregadorRoutes");
const notificacaoRoutes = require("./notificacaoRoutes");
const categoriaRoutes = require("./categoriaRoutes");
const publicRoutes = require("./publicRoutes");
const medicamentoRoutes = require("./medicamentoRoutes");
const adminRoutes = require("./adminRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/cliente", clienteRoutes);
router.use("/farmacia", farmaciaRoutes);
router.use("/entregador", entregadorRoutes);
router.use("/notificacoes", notificacaoRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/public", publicRoutes);
router.use("/medicamentos", medicamentoRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
