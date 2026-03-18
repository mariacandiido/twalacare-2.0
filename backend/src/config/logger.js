/**
 * Winston: logs por níveis (error, warn, info, http).
 * Em produção pode escrever em ficheiros.
 */
const winston = require('winston');

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts }) => {
  return `${ts} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});

/* Em produção, adicionar transporte para ficheiro de erros */
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(timestamp(), logFormat),
    })
  );
}

module.exports = logger;
