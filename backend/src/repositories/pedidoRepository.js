/**
 * Repositório de pedidos: criar, listar por cliente/farmácia, atualizar status.
 */
const { prisma } = require('../lib/prisma');

async function create(pedidoData, items) {
  return prisma.$transaction(async (tx) => {
    const pedido = await tx.pedido.create({ data: pedidoData });

    const pedidoItems = items.map((item) => ({
      pedido_id: pedido.id,
      medicamento_id: item.medicamento_id,
      farmacia_id: item.farmacia_id,
      nome: item.nome,
      preco_unitario: item.preco_unitario,
      quantidade: item.quantidade,
      requires_prescription: item.requires_prescription || false,
    }));

    await tx.pedidoItem.createMany({
      data: pedidoItems,
    });

    await tx.entrega.create({
      data: {
        pedido_id: pedido.id,
        status: 'DISPONIVEL',
        valor_entrega: pedidoData.taxa_entrega || 0,
      },
    });

    return findById(pedido.id);
  });
}

async function findById(id) {
  return prisma.pedido.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      PedidoItems: true,
      Cliente: { select: { id: true, nome: true, email: true, telefone: true, endereco: true } },
      Entrega: true,
    },
  });
}

async function findByCliente(clienteId, limit = 50, offset = 0) {
  const where = { cliente_id: parseInt(clienteId, 10) };
  const [count, rows] = await Promise.all([
    prisma.pedido.count({ where }),
    prisma.pedido.findMany({
      where,
      skip: parseInt(offset, 10) || 0,
      take: parseInt(limit, 10) || 50,
      include: { PedidoItems: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return { count, rows };
}

async function findByFarmacia(farmaciaId, limit = 50, offset = 0) {
  const where = { PedidoItems: { some: { farmacia_id: parseInt(farmaciaId, 10) } } };
  const [count, rows] = await Promise.all([
    prisma.pedido.count({ where }),
    prisma.pedido.findMany({
      where,
      skip: parseInt(offset, 10) || 0,
      take: parseInt(limit, 10) || 50,
      include: {
        PedidoItems: true,
        Cliente: { select: { id: true, nome: true, email: true, telefone: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return { count, rows };
}

async function updateStatus(id, status) {
  const data = { status };
  if (status === 'ENTREGUE') {
    data.data_entrega = new Date();
  }
  await prisma.pedido.update({
    where: { id: parseInt(id, 10) },
    data,
  });
  return findById(id);
}

module.exports = { create, findById, findByCliente, findByFarmacia, updateStatus };
