/**
 * Repositório de farmácias: listar aprovadas/pendentes, aprovar, rejeitar, criar/atualizar com Prisma.
 */
const { prisma } = require('../lib/prisma');

async function findAll(options = {}) {
  const { status, limit = 50, offset = 0 } = options;
  const where = {};
  if (status) where.User = { status };

  return prisma.farmacia.findMany({
    where,
    take: limit,
    skip: offset,
    include: {
      User: {
        select: { id: true, nome: true, email: true, telefone: true, tipo: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function findById(id) {
  return prisma.farmacia.findUnique({
    where: { id },
    include: {
      User: {
        select: { id: true, nome: true, email: true, telefone: true },
      },
    },
  });
}

async function findByUserId(userId) {
  return prisma.farmacia.findUnique({
    where: { user_id: userId },
  });
}

async function update(id, data) {
  return prisma.farmacia.update({
    where: { id },
    data,
  });
}

module.exports = { findAll, findById, findByUserId, update };
