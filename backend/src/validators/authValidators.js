/**
 * Validação de body/query para rotas de autenticação (express-validator).
 */
const { body, query } = require('express-validator');

const registerRules = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório').isLength({ max: 150 }),
  body('email').trim().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('A senha deve ter pelo menos 6 caracteres'),
  body('tipo')
    .isIn(['cliente', 'farmacia', 'entregador', 'admin'])
    .withMessage('Tipo de conta inválido'),
  body('telefone').optional().trim().isLength({ max: 30 }),
  body('dataNascimento').optional().isISO8601(),
  body('provincia').optional().trim().isLength({ max: 80 }),
  body('municipio').optional().trim().isLength({ max: 80 }),
  body('endereco').optional().trim().isLength({ max: 255 }),
  body('veiculo').optional().trim().isLength({ max: 50 }),
  body('placaVeiculo').optional().trim().isLength({ max: 20 }),
  body('nomeFarmacia').optional().trim().isLength({ max: 150 }),
  body('nif').optional().trim().isLength({ max: 30 }),
];

const loginRules = [
  body('identifier').trim().notEmpty().withMessage('Email ou telefone é obrigatório'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  body('tipo')
    .isIn(['cliente', 'farmacia', 'entregador', 'admin'])
    .withMessage('Tipo de conta inválido'),
];

const refreshRules = [body('refreshToken').notEmpty().withMessage('Refresh token é obrigatório')];

const checkEmailRules = [query('email').isEmail().withMessage('Email inválido')];

module.exports = {
  registerRules,
  loginRules,
  refreshRules,
  checkEmailRules,
};
