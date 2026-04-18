/**
 * Repositório de utilizadores: acesso a dados User, Farmacia e RefreshToken com Prisma.
 */
const { prisma } = require('../lib/prisma');

async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      nome: true,
      email: true,
      password_hash: true,
      telefone: true,
      tipo: true,
      status: true,
      createdAt: true,
    },
  });
}

async function findByTelefone(telefone) {
  return prisma.user.findUnique({
    where: { telefone },
    select: {
      id: true,
      nome: true,
      email: true,
      password_hash: true,
      telefone: true,
      tipo: true,
      status: true,
      createdAt: true,
    },
  });
}

async function findById(id, includeFarmacia = false) {
  const select = {
    id: true,
    nome: true,
    email: true,
    telefone: true,
    tipo: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  };

  if (includeFarmacia) {
    select.Farmacia = {
      select: {
        id: true,
        nome: true,
      },
    };
  }

  return prisma.user.findUnique({
    where: { id },
    select,
  });
}

async function createUser(data) {
  return prisma.user.create({ data });
}

async function createFarmacia(data) {
  return prisma.farmacia.create({ data });
}

async function saveRefreshToken(userId, token, expiresAt) {
  return prisma.refreshToken.create({
    data: { user_id: userId, token, expires_at: expiresAt },
  });
}

async function findRefreshToken(token) {
  return prisma.refreshToken.findFirst({
    where: { token, revoked: false },
    include: {
      User: {
        select: { id: true, nome: true, email: true, tipo: true, status: true },
      },
    },
  });
}

async function revokeRefreshToken(token) {
  return prisma.refreshToken.updateMany({
    where: { token },
    data: { revoked: true },
  });
}

async function findAll(options = {}) {
  const { tipo, status, limit = 50, offset = 0 } = options;
  const where = {};
  if (tipo) where.tipo = tipo;
  if (status) where.status = status;

  return prisma.user.findMany({
    where,
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' },
    include: { Farmacia: true },
  });
}

async function update(id, data) {
  const allowed = [
    'nome', 'telefone', 'data_nascimento', 'provincia', 'municipio', 'endereco',
    'veiculo', 'placa_veiculo', 'cargo', 'departamento', 'status',
  ];

  const updateData = {};
  allowed.forEach((key) => {
    if (data[key] !== undefined) updateData[key] = data[key];
  });

  return prisma.user.update({
    where: { id },
    data: updateData,
  });
}

module.exports = {
  findByEmail,
  findByTelefone,
  findById,
  createUser,
  createFarmacia,
  saveRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  findAll,
  update,
};
