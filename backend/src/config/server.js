/**
 * Configuração do servidor: porta e ambiente.
 */
module.exports = {
  PORT: parseInt(process.env.PORT, 10) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
