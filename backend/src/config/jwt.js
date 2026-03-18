/**
 * Configuração JWT: segredos e tempos de expiração.
 */
module.exports = {
  secret: process.env.JWT_SECRET || 'default_secret_alterar_em_producao',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_alterar',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};
