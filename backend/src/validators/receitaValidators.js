const { body, query, param } = require("express-validator");

const createReceitaRules = [
  body("pedido_id").optional().isInt().withMessage("Pedido_id inválido"),
  body("farmacia_id").optional().isInt().withMessage("Farmacia_id inválido"),
  body("ficheiro_url").optional().isURL().withMessage("Ficheiro_url inválido"),
  body("nome_ficheiro").optional().trim().isLength({ max: 255 }),
];

const updateEstadoRules = [
  param("id").isInt().withMessage("ID inválido"),
  body("estado")
    .isIn(["pendente", "aprovada", "rejeitada"])
    .withMessage("Estado inválido"),
  body("observacoes").optional().trim().isLength({ max: 300 }),
];

module.exports = { createReceitaRules, updateEstadoRules };
