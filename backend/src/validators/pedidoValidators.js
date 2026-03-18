const { body, query, param } = require("express-validator");

const createPedidoRules = [
  body("items").isArray({ min: 1 }).withMessage("Items são obrigatórios"),
  body("items.*.medicamento_id").isInt().withMessage("Medicamento_id inválido"),
  body("items.*.quantidade")
    .isInt({ min: 1 })
    .withMessage("Quantidade deve ser >= 1"),
  body("subtotal").isFloat({ min: 0 }).withMessage("Subtotal inválido"),
  body("taxa_entrega").optional().isFloat({ min: 0 }),
  body("total").isFloat({ min: 0 }).withMessage("Total inválido"),
  body("metodo_pagamento")
    .trim()
    .notEmpty()
    .withMessage("Método de pagamento obrigatório"),
  body("endereco_entrega")
    .trim()
    .notEmpty()
    .withMessage("Endereço de entrega obrigatório"),
];

const statusRules = [
  param("id").isInt().withMessage("ID inválido"),
  body("status")
    .isIn(["pendente", "cancelado", "confirmado", "em_transito", "entregue"])
    .withMessage("Status inválido"),
];

const getPedidosRules = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];

module.exports = { createPedidoRules, statusRules, getPedidosRules };
