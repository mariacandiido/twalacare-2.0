const { body, query, param } = require("express-validator");

const aceitarRules = [param("id").isInt().withMessage("ID inválido")];

const statusRules = [
  param("id").isInt().withMessage("ID inválido"),
  body("status")
    .isIn(["aceito", "em_transito", "entregue", "cancelado"])
    .withMessage("Status de entrega inválido"),
];

module.exports = { aceitarRules, statusRules };
