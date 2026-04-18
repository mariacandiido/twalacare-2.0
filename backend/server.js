/**
 * Ponto de entrada da aplicação.
 * Carrega variáveis de ambiente e inicia o servidor Express.
 */
require("dotenv").config();
const app = require("./src/app");
const logger = require("./src/config/logger");
const { PORT } = require("./src/config/server");
const { prisma } = require("./src/lib/prisma");

let server;

async function startServer() {
  try {
    await prisma.$connect();
    server = app.listen(PORT, () => {
      logger.info(
        `Servidor a correr em http://localhost:${PORT} (${process.env.NODE_ENV || "development"})`,
      );
    });

    /* Encerramento gracioso */
    const shutdown = async () => {
      logger.info("Encerrando servidor...");
      server.close(async () => {
        try {
          await prisma.$disconnect();
        } catch (err) {
          logger.error("Erro ao desconectar Prisma", err);
        } finally {
          process.exit(0);
        }
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    logger.error(
      "Falha de inicialização. Verifique a base de dados e as variáveis de ambiente",
      error,
    );
    process.exit(1);
  }
}

startServer();

module.exports = { startServer, server };
