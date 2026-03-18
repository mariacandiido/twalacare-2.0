/**
 * Rotas de receitas: criar (cliente), listar (cliente/farmácia), aprovar/rejeitar (farmácia).
 */
const express = require("express");
const receitaController = require("../controllers/receitaController");
const { authenticate, requireRoles } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  createReceitaRules,
  updateEstadoRules,
} = require("../validators/receitaValidators");

const router = express.Router();

router.post(
  "/",
  authenticate,
  requireRoles(["cliente"]),
  createReceitaRules,
  validate,
  receitaController.create,
);
router.get(
  "/me",
  authenticate,
  requireRoles(["cliente"]),
  receitaController.listMy,
);
router.get(
  "/farmacia",
  authenticate,
  requireRoles(["farmacia"]),
  receitaController.listFarmacia,
);
router.patch(
  "/:id/estado",
  authenticate,
  requireRoles(["farmacia"]),
  updateEstadoRules,
  validate,
  receitaController.updateEstado,
);

module.exports = router;
