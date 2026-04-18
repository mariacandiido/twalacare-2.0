/**
 * Rotas de medicamentos: listar e obter (público), CRUD (autenticado farmácia/admin).
 */
const express = require("express");
const medicamentoController = require("../controllers/medicamentoController");
const { authenticate, requireRoles } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  createMedicamentoRules,
  updateMedicamentoRules,
} = require("../validators/medicamentoValidators");

const router = express.Router();

router.get("/", medicamentoController.list);
router.get("/:id", medicamentoController.getById);

router.post(
  "/",
  authenticate,
  requireRoles(["farmacia", "admin"]),
  createMedicamentoRules,
  validate,
  medicamentoController.create,
);
router.patch(
  "/:id",
  authenticate,
  requireRoles(["farmacia", "admin"]),
  updateMedicamentoRules,
  validate,
  medicamentoController.update,
);

module.exports = router;
