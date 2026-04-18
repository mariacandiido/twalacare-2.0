const { prisma } = require("../lib/prisma");

const DEFAULT_PAGE_LIMIT = 50;

async function listFarmacias({ status, page = 1, limit = DEFAULT_PAGE_LIMIT }) {
  const offset = (Number(page) - 1) * Number(limit);
  const where = {};
  if (status) where.status = status;

  return prisma.farmacia.findMany({
    where,
    take: Number(limit),
    skip: offset,
    orderBy: { createdAt: "desc" },
    include: {
      User: { select: { id: true, nome: true, email: true, status: true } },
    },
  });
}

async function getFarmaciaById(id) {
  const farmacia = await prisma.farmacia.findUnique({
    where: { id: Number(id) },
    include: { User: true },
  });
  if (!farmacia) {
    const err = new Error("Farmácia não encontrada");
    err.status = 404;
    throw err;
  }
  return farmacia;
}

async function approveFarmacia(id) {
  const farmacia = await getFarmaciaById(id);
  return prisma.user.update({
    where: { id: farmacia.user_id },
    data: { status: "APROVADO" },
  });
}

async function rejectFarmacia(id, motivo) {
  const farmacia = await getFarmaciaById(id);
  return prisma.user.update({
    where: { id: farmacia.user_id },
    data: { status: "PENDENTE" },
  });
}

async function blockFarmacia(id) {
  const farmacia = await getFarmaciaById(id);
  const user = await prisma.user.findUnique({ where: { id: farmacia.user_id } });
  if (user.status !== "APROVADO") {
    const err = new Error("Só é possível bloquear farmácias aprovadas");
    err.status = 400;
    throw err;
  }
  return prisma.user.update({
    where: { id: farmacia.user_id },
    data: { status: "SUSPENSO" },
  });
}

async function unblockFarmacia(id) {
  const farmacia = await getFarmaciaById(id);
  const user = await prisma.user.findUnique({ where: { id: farmacia.user_id } });
  if (user.status !== "APROVADO") {
    const err = new Error("Só é possível desbloquear farmácias aprovadas");
    err.status = 400;
    throw err;
  }
  return prisma.user.update({
    where: { id: farmacia.user_id },
    data: { status: "ATIVO" },
  });
}

async function listEntregadores({
  status,
  page = 1,
  limit = DEFAULT_PAGE_LIMIT,
}) {
  const where = { tipo: "ENTREGADOR" };
  if (status) where.status = status;
  const offset = (Number(page) - 1) * Number(limit);

  return prisma.user.findMany({
    where,
    take: Number(limit),
    skip: offset,
    orderBy: { createdAt: "desc" },
  });
}

async function getEntregadorById(id) {
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!user || user.tipo !== "ENTREGADOR") {
    const err = new Error("Entregador não encontrado");
    err.status = 404;
    throw err;
  }
  return user;
}

async function approveEntregador(id) {
  const entregador = await getEntregadorById(id);
  return prisma.user.update({
    where: { id: entregador.id },
    data: { status: "APROVADO" },
  });
}

async function rejectEntregador(id) {
  const entregador = await getEntregadorById(id);
  return prisma.user.update({
    where: { id: entregador.id },
    data: { status: "PENDENTE" },
  });
}

async function blockEntregador(id) {
  const entregador = await getEntregadorById(id);
  return prisma.user.update({
    where: { id: entregador.id },
    data: { status: "SUSPENSO" },
  });
}

async function unblockEntregador(id) {
  const entregador = await getEntregadorById(id);
  if (entregador.status === "PENDENTE") {
    const err = new Error("Entregador ainda pendente de aprovação");
    err.status = 400;
    throw err;
  }
  return prisma.user.update({
    where: { id: entregador.id },
    data: { status: "APROVADO" },
  });
}

async function listClientes({ page = 1, limit = DEFAULT_PAGE_LIMIT }) {
  const offset = (Number(page) - 1) * Number(limit);
  return prisma.user.findMany({
    where: { tipo: "CLIENTE" },
    take: Number(limit),
    skip: offset,
    orderBy: { createdAt: "desc" },
  });
}

async function listPedidos({ page = 1, limit = DEFAULT_PAGE_LIMIT }) {
  const offset = (Number(page) - 1) * Number(limit);
  return prisma.pedido.findMany({
    take: Number(limit),
    skip: offset,
    orderBy: { createdAt: "desc" },
    include: {
      Cliente: { select: { id: true, nome: true, email: true } },
      Entrega: true,
      PedidoItems: {
        select: { id: true, quantidade: true, preco: true, farmacia_id: true },
      },
    },
  });
}

async function getDashboardMetrics() {
  const [
    farmaciasTotal,
    entregadoresTotal,
    clientesTotal,
    pedidosTotal,
    pedidosPendentes,
  ] = await Promise.all([
    prisma.farmacia.count(),
    prisma.user.count({ where: { tipo: "ENTREGADOR" } }),
    prisma.user.count({ where: { tipo: "CLIENTE" } }),
    prisma.pedido.count(),
    prisma.pedido.count({ where: { status: "PENDENTE" } }),
  ]);

  const statusByFarmacia = await prisma.user.groupBy({
    by: ["status"],
    where: { tipo: "FARMACIA" },
    _count: { id: true },
  });

  const statusByPedido = await prisma.pedido.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  return {
    farmaciasTotal,
    entregadoresTotal,
    clientesTotal,
    pedidosTotal,
    pedidosPendentes,
    statusByFarmacia,
    statusByPedido,
    createdAt: new Date(),
  };
}

async function generateReport({ tipo = "vendas" }) {
  if (tipo === "usuarios") {
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { type: "usuarios", total: usuarios.length, dados: usuarios };
  }

  if (tipo === "pedidos") {
    const pedidos = await prisma.pedido.findMany({
      include: {
        Cliente: { select: { id: true, nome: true } },
        PedidoItems: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { type: "pedidos", total: pedidos.length, dados: pedidos };
  }

  return { type: "metricas", dados: await getDashboardMetrics() };
}

// Novos métodos para gerenciamento de usuários

async function getAllUsers({
  tipo,
  status,
  page = 1,
  limit = DEFAULT_PAGE_LIMIT,
}) {
  const offset = (Number(page) - 1) * Number(limit);
  const where = {};
  if (tipo) where.tipo = tipo;
  if (status) where.status = status;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      take: Number(limit),
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: { Farmacia: true },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page: Number(page), limit: Number(limit) };
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { Farmacia: true, Endereco: true },
  });
  if (!user) {
    const err = new Error("Utilizador não encontrado");
    err.status = 404;
    throw err;
  }
  return user;
}

async function blockUser(id) {
  const user = await getUserById(id);
  if (user.tipo === "ADMIN") {
    const err = new Error("Não é possível bloquear admins");
    err.status = 400;
    throw err;
  }
  return prisma.user.update({
    where: { id: Number(id) },
    data: { status: "SUSPENSO" },
  });
}

async function unblockUser(id) {
  const user = await getUserById(id);
  return prisma.user.update({
    where: { id: Number(id) },
    data: { status: "ATIVO" },
  });
}

async function createAdmin({ nome, email, password_hash }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("Email já existe");
    err.status = 400;
    throw err;
  }

  return prisma.user.create({
    data: {
      nome,
      email,
      password_hash,
      tipo: "ADMIN",
      status: "ATIVO",
    },
  });
}

async function removeAdmin(id) {
  const user = await getUserById(id);
  if (user.tipo !== "ADMIN") {
    const err = new Error("Utilizador não é um admin");
    err.status = 400;
    throw err;
  }

  // Contar quantos admins existem
  const adminCount = await prisma.user.count({ where: { tipo: "ADMIN" } });
  if (adminCount <= 1) {
    const err = new Error("Não pode remover o último admin");
    err.status = 400;
    throw err;
  }

  // Em vez de deletar, marcar como inativo
  return prisma.user.update({
    where: { id: Number(id) },
    data: { status: "INATIVO", tipo: "CLIENTE" }, // Converter para cliente
  });
}

async function registerAdminLog({
  admin_id,
  acao,
  tipo_alvo,
  id_alvo,
  descricao,
  detalhes = {},
  ip_address = "127.0.0.1",
}) {
  return prisma.adminLog.create({
    data: {
      admin_id: Number(admin_id),
      acao,
      tipo_alvo,
      id_alvo: Number(id_alvo),
      descricao,
      detalhes: JSON.stringify(detalhes),
      ip_address,
    },
  });
}

async function getAdminLogs({
  page = 1,
  limit = DEFAULT_PAGE_LIMIT,
  admin_id = null,
}) {
  const offset = (Number(page) - 1) * Number(limit);
  const where = admin_id ? { admin_id: Number(admin_id) } : {};

  const [logs, total] = await Promise.all([
    prisma.adminLog.findMany({
      where,
      take: Number(limit),
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: { Admin: { select: { id: true, nome: true, email: true } } },
    }),
    prisma.adminLog.count({ where }),
  ]);

  return { logs, total, page: Number(page), limit: Number(limit) };
}

async function listAdmins({ page = 1, limit = DEFAULT_PAGE_LIMIT }) {
  const offset = (Number(page) - 1) * Number(limit);
  const [admins, total] = await Promise.all([
    prisma.user.findMany({
      where: { tipo: "ADMIN" },
      take: Number(limit),
      skip: offset,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nome: true,
        email: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where: { tipo: "ADMIN" } }),
  ]);

  return { admins, total, page: Number(page), limit: Number(limit) };
}

module.exports = {
  listFarmacias,
  getFarmaciaById,
  approveFarmacia,
  rejectFarmacia,
  blockFarmacia,
  unblockFarmacia,
  listEntregadores,
  getEntregadorById,
  approveEntregador,
  rejectEntregador,
  blockEntregador,
  unblockEntregador,
  listClientes,
  listPedidos,
  getDashboardMetrics,
  generateReport,
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  createAdmin,
  removeAdmin,
  registerAdminLog,
  getAdminLogs,
  listAdmins,
};
