/**
 * Repositório de entregas: listar disponíveis, por entregador, aceitar, atualizar status.
 */
const { prisma } = require('../lib/prisma');

async function findDisponiveis(limit = 20) {
  return prisma.entrega.findMany({
    where: { status: 'DISPONIVEL', entregador_id: null },
    include: { Pedido: { include: { Cliente: true } } },
    take: parseInt(limit, 10) || 20,
  });
}

async function findByEntregador(entregadorId, limit = 50, offset = 0) {
  const [count, rows] = await Promise.all([
    prisma.entrega.count({ where: { entregador_id: parseInt(entregadorId, 10) } }),
    prisma.entrega.findMany({
      where: { entregador_id: parseInt(entregadorId, 10) },
      include: { Pedido: true },
      skip: parseInt(offset, 10) || 0,
      take: parseInt(limit, 10) || 50,
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return { count, rows };
}

async function findById(id) {
  return prisma.entrega.findUnique({
    where: { id: parseInt(id, 10) },
    include: { Pedido: true, Entregador: true },
  });
}

async function aceitar(entregaId, entregadorId) {
  const entrega = await prisma.entrega.findUnique({ where: { id: parseInt(entregaId, 10) } });
  if (!entrega || entrega.status !== 'DISPONIVEL') return null;
  await prisma.entrega.update({
    where: { id: parseInt(entregaId, 10) },
    data: { entregador_id: parseInt(entregadorId, 10), status: 'ACEITO' },
  });
  return findById(entregaId);
}

async function updateStatus(id, status) {
  const entrega = await prisma.entrega.findUnique({ where: { id: parseInt(id, 10) } });
  if (!entrega) return null;
  await prisma.entrega.update({ where: { id: parseInt(id, 10) }, data: { status } });
  return findById(id);
}

module.exports = { findDisponiveis, findByEntregador, findById, aceitar, updateStatus };
