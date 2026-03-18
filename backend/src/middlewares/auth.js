/**
 * Middlewares de autenticação JWT e verificação de roles.
 */
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { prisma } = require('../lib/prisma');
const { sendError } = require('./errorHandler');

/**
 * Extrai e valida o token JWT do header Authorization (Bearer).
 * Coloca req.user com o utilizador.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Token de autenticação ausente ou inválido');
    }
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, jwtConfig.secret);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return sendError(res, 401, 'Utilizador não encontrado');
    }
    if (user.status !== 'ATIVO' && user.tipo !== 'ADMIN') {
      return sendError(res, 403, 'Conta inativa ou pendente de aprovação');
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token expirado');
    }
    if (err.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Token inválido');
    }
    next(err);
  }
}

/**
 * Opcional: só exige auth se o token for enviado (útil para rotas que podem ser públicas ou privadas)
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  return authenticate(req, res, next);
}

/**
 * Requer que req.user.tipo esteja em allowedTypes (ex: ['admin'], ['farmacia', 'admin'])
 */
function requireRoles(allowedTypes) {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Autenticação necessária');
    }
    if (!allowedTypes.includes(req.user.tipo)) {
      return sendError(res, 403, 'Sem permissão para este recurso');
    }
    next();
  };
}

module.exports = { authenticate, optionalAuth, requireRoles };
