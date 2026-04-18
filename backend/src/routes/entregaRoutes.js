/**
 * Rotas de entregas: disponíveis, minhas, aceitar, atualizar status.
 */
const express = require("express");
const entregaController = require("../controllers/entregaController");
const { authenticate, requireRoles } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  aceitarRules,
  statusRules,
} = require("../validators/entregaValidators");

const router = express.Router();

router.get(
  "/disponiveis",
  authenticate,
  requireRoles(["entregador"]),
  entregaController.listDisponiveis,
);
router.get(
  "/me",
  authenticate,
  requireRoles(["entregador"]),
  entregaController.listMinhas,
);
router.post(
  "/:id/aceitar",
  authenticate,
  requireRoles(["entregador"]),
  aceitarRules,
  validate,
  entregaController.aceitar,
);
router.patch(
  "/:id/status",
  authenticate,
  requireRoles(["entregador"]),
  statusRules,
  validate,
  entregaController.updateStatus,
);

module.exports = router;
