/**
 * Ponto de entrada da aplicação.
 * Carrega variáveis de ambiente e inicia o servidor Express.
 */
require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/config/logger');
const { PORT } = require('./src/config/server');

const server = app.listen(PORT, () => {
  logger.info(`Servidor a correr em http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`);
});

/* Encerramento gracioso */
process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido. A encerrar servidor...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  logger.info('SIGINT recebido. A encerrar servidor...');
  server.close(() => process.exit(0));
});

module.exports = server;
