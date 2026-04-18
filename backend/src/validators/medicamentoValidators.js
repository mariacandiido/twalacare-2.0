const { body, query, param } = require("express-validator");

const createMedicamentoRules = [
  body("nome")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ max: 200 }),
  body("descricao").optional().trim().isLength({ max: 500 }),
  body("preco").isFloat({ min: 0 }).withMessage("Preço inválido"),
  body("quantidade").isInt({ min: 0 }).withMessage("Quantidade inválida"),
  body("categoria").optional().trim().isLength({ max: 80 }),
  body("farmacia_id").optional().isInt().withMessage("Farmacia_id inválido"),
  body("provincia").optional().trim().isLength({ max: 80 }),
];

const updateMedicamentoRules = [
  param("id").isInt().withMessage("ID inválido"),
  body("nome").optional().trim().isLength({ max: 200 }),
  body("descricao").optional().trim().isLength({ max: 500 }),
  body("preco").optional().isFloat({ min: 0 }),
  body("quantidade").optional().isInt({ min: 0 }),
  body("categoria").optional().trim().isLength({ max: 80 }),
  body("ativo").optional().isBoolean().withMessage("Ativo deve ser booleano"),
];

module.exports = { createMedicamentoRules, updateMedicamentoRules };
