/**
 * Repositório de pedidos: criar, listar por cliente/farmácia, atualizar status.
 */
const db = require('../database');

async function create(pedidoData, items) {
  const t = await db.sequelize.transaction();
  try {
    const pedido = await db.Pedido.create(pedidoData, { transaction: t });
    for (const item of items) {
      await db.PedidoItem.create(
        {
          pedido_id: pedido.id,
          medicamento_id: item.medicamento_id,
          farmacia_id: item.farmacia_id,
          nome: item.nome,
          preco_unitario: item.preco_unitario,
          quantidade: item.quantidade,
          requires_prescription: item.requires_prescription || false,
        },
        { transaction: t }
      );
    }
    /* Cria entrega disponível para o pedido */
    await db.Entrega.create(
      { pedido_id: pedido.id, status: 'disponivel', valor_entrega: pedidoData.taxa_entrega || 0 },
      { transaction: t }
    );
    await t.commit();
    return findById(pedido.id);
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

async function findById(id) {
  return db.Pedido.findByPk(id, {
    include: [
      { model: db.PedidoItem, as: 'PedidoItems' },
      { model: db.User, as: 'User', attributes: ['id', 'nome', 'email', 'telefone', 'endereco'] },
    ],
  });
}

async function findByCliente(clienteId, limit = 50, offset = 0) {
  return db.Pedido.findAndCountAll({
    where: { cliente_id: clienteId },
    limit,
    offset,
    include: [{ model: db.PedidoItem, as: 'PedidoItems' }],
    order: [['data_pedido', 'DESC']],
  });
}

async function findByFarmacia(farmaciaId, limit = 50, offset = 0) {
  const pedidos = await db.Pedido.findAndCountAll({
    include: [
      { model: db.PedidoItem, as: 'PedidoItems', where: { farmacia_id: farmaciaId }, required: true },
      { model: db.User, as: 'User', attributes: ['id', 'nome', 'email', 'telefone'] },
    ],
    limit,
    offset,
    order: [['data_pedido', 'DESC']],
  });
  return pedidos;
}

async function updateStatus(id, status) {
  const pedido = await db.Pedido.findByPk(id);
  if (!pedido) return null;
  const update = { status };
  if (status === 'entregue') update.data_entrega = new Date().toISOString().split('T')[0];
  await pedido.update(update);
  return findById(id);
}

module.exports = { create, findById, findByCliente, findByFarmacia, updateStatus };
