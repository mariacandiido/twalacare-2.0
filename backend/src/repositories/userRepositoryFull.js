/**
 * Repositório estendido: listar utilizadores (admin), atualizar perfil.
 */
const { prisma } = require('../lib/prisma');

async function findAll(options = {}) {
  const { tipo, status, limit = 50, offset = 0 } = options;
  const where = {
    ...(tipo ? { tipo } : {}),
    ...(status ? { status } : {}),
  };

  const [count, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip: parseInt(offset, 10) || 0,
      take: parseInt(limit, 10) || 50,
      orderBy: { created_at: 'desc' },
      include: { Farmacia: true },
    }),
  ]);

  return { count, rows: users };
}

async function update(id, data) {
  const allowed = [
    'nome', 'telefone', 'data_nascimento', 'provincia', 'municipio', 'endereco',
    'veiculo', 'placa_veiculo', 'cargo', 'departamento', 'status',
  ];
  const toSet = {};
  allowed.forEach((k) => {
    if (data[k] !== undefined) toSet[k] = data[k];
  });

  const user = await prisma.user.update({
    where: { id: parseInt(id, 10) },
    data: toSet,
  });

  return user;
}

module.exports = { findAll, update };
