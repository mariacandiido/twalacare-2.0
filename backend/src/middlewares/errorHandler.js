/**
 * Middlewares globais de erro: 404 e handler genérico.
 * Respostas padronizadas em JSON.
 */
const logger = require('../config/logger');

/**
 * Resposta padrão de erro da API
 * @param {object} res - Express response
 * @param {number} statusCode
 * @param {string} message
 * @param {object} [details]
 */
function sendError(res, statusCode, message, details = null) {
  const body = { status: 'error', message };
  if (details) body.details = details;
  res.status(statusCode).json(body);
}

/**
 * 404 - recurso não encontrado
 */
function notFoundHandler(req, res, next) {
  sendError(res, 404, 'Recurso não encontrado');
}

/**
 * Handler global de erros (4 parâmetros)
 */
function errorHandler(err, req, res, next) {
  logger.error(err.message || err);

  if (err.name === 'ValidationError') {
    return sendError(res, 400, 'Dados inválidos', err.errors);
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return sendError(res, 409, 'Registo duplicado (ex.: email já existe)');
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return sendError(res, 400, 'Referência inválida');
  }
  if (err.status === 401) {
    return sendError(res, 401, err.message || 'Não autorizado');
  }
  if (err.status === 403) {
    return sendError(res, 403, err.message || 'Acesso negado');
  }

  const status = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Erro interno' : (err.message || 'Erro interno');
  sendError(res, status, message);
}

module.exports = { errorHandler, notFoundHandler, sendError };
