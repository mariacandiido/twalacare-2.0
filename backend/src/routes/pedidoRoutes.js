/**
 * Rotas de pedidos: criar (cliente), listar meus (cliente), por farmácia, atualizar status.
 */
const express = require("express");
const pedidoController = require("../controllers/pedidoController");
const { authenticate, requireRoles } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  createPedidoRules,
  statusRules,
} = require("../validators/pedidoValidators");

const router = express.Router();

router.post(
  "/",
  authenticate,
  requireRoles(["cliente"]),
  createPedidoRules,
  validate,
  pedidoController.create,
);
router.get(
  "/me",
  authenticate,
  requireRoles(["cliente"]),
  pedidoController.getMy,
);
router.get(
  "/farmacia",
  authenticate,
  requireRoles(["farmacia"]),
  pedidoController.listByFarmacia,
);
router.get("/:id", authenticate, pedidoController.getById);
router.patch(
  "/:id/status",
  authenticate,
  statusRules,
  validate,
  pedidoController.updateStatus,
);

module.exports = router;
