/**
 * Middleware que executa express-validator e devolve 400 com erros se falhar.
 */
const { validationResult } = require('express-validator');
const { sendError } = require('./errorHandler');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return sendError(res, 400, 'Dados inválidos', messages);
  }
  next();
}

module.exports = validate;
