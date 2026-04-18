/**
 * Repositório de receitas: criar, listar por cliente/farmácia, atualizar estado.
 */
const { prisma } = require('../lib/prisma');

async function create(data) {
  return prisma.receita.create({ data });
}

async function findByCliente(clienteId, limit = 50, offset = 0) {
  const where = { cliente_id: parseInt(clienteId, 10) };
  const [count, rows] = await Promise.all([
    prisma.receita.count({ where }),
    prisma.receita.findMany({
      where,
      skip: parseInt(offset, 10) || 0,
      take: parseInt(limit, 10) || 50,
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return { count, rows };
}

async function findByFarmacia(farmaciaId, limit = 50, offset = 0) {
  const where = { farmacia_id: parseInt(farmaciaId, 10) };
  const [count, rows] = await Promise.all([
    prisma.receita.count({ where }),
    prisma.receita.findMany({
      where,
      skip: parseInt(offset, 10) || 0,
      take: parseInt(limit, 10) || 50,
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return { count, rows };
}

async function updateEstado(id, estado, observacoes) {
  const existing = await prisma.receita.findUnique({
    where: { id: parseInt(id, 10) },
  });
  if (!existing) return null;
  return prisma.receita.update({
    where: { id: parseInt(id, 10) },
    data: { estado, observacoes: observacoes || null },
  });
}

module.exports = { create, findByCliente, findByFarmacia, updateEstado };
