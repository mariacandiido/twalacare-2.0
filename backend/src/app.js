/**
 * Aplicação Express principal.
 * Monta middlewares globais, CORS, rotas e tratamento de erros.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { corsOptions } = require('./config/cors');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');
const logger = require('./config/logger');

const app = express();

/* Segurança: headers HTTP */
app.use(helmet());

/* CORS conforme config */
app.use(cors(corsOptions));

/* Rate limiting para mitigar abuso */
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  message: { status: 'error', message: 'Muitas requisições. Tente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

/* Log de requisições */
app.use(morgan('combined', { stream: { write: (msg) => logger.http(msg.trim()) } }));

/* Body parser */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* Servir ficheiros estáticos de upload (imagens de medicamentos, receitas) */
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

/* Rota de saúde */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* API */
app.use('/api', routes);

/* Documentação Swagger */
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* 404 e erro global */
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
