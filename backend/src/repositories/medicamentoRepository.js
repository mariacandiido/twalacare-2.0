/**
 * Repositório de medicamentos: CRUD e listagem com filtros.
 */
const { prisma } = require('../lib/prisma');

async function findAll(options = {}) {
  const { farmacia_id, categoria, provincia, busca, limit = 50, offset = 0 } = options;
  const where = {
    ativo: true,
    ...(farmacia_id ? { farmacia_id: parseInt(farmacia_id, 10) } : {}),
    ...(categoria ? { categoria } : {}),
    ...(provincia ? { provincia } : {}),
    ...(busca
      ? {
          OR: [
            { nome: { contains: busca, mode: 'insensitive' } },
            { descricao: { contains: busca, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [count, rows] = await Promise.all([
    prisma.medicamento.count({ where }),
    prisma.medicamento.findMany({
      where,
      skip: parseInt(offset, 10) || 0,
      take: parseInt(limit, 10) || 50,
      include: { Farmacia: { select: { id: true, nome: true } } },
      orderBy: { nome: 'asc' },
    }),
  ]);

  return { count, rows };
}

async function findById(id) {
  return prisma.medicamento.findUnique({
    where: { id: parseInt(id, 10) },
    include: { Farmacia: true },
  });
}

async function create(data) {
  return prisma.medicamento.create({ data });
}

async function update(id, data) {
  await prisma.medicamento.update({
    where: { id: parseInt(id, 10) },
    data,
  });
  return findById(id);
}

module.exports = { findAll, findById, create, update };
