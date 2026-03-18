/**
 * Repositório de entregas: listar disponíveis, por entregador, aceitar, atualizar status.
 */
const db = require('../database');

async function findDisponiveis(limit = 20) {
  return db.Entrega.findAll({
    where: { status: 'disponivel', entregador_id: null },
    include: [
      { model: db.Pedido, as: 'Pedido', include: [{ model: db.User, as: 'User' }] },
    ],
    limit,
  });
}

async function findByEntregador(entregadorId, limit = 50, offset = 0) {
  return db.Entrega.findAndCountAll({
    where: { entregador_id: entregadorId },
    include: [{ model: db.Pedido, as: 'Pedido' }],
    limit,
    offset,
    order: [['created_at', 'DESC']],
  });
}

async function findById(id) {
  return db.Entrega.findByPk(id, {
    include: [{ model: db.Pedido, as: 'Pedido' }, { model: db.User, as: 'User' }],
  });
}

async function aceitar(entregaId, entregadorId) {
  const entrega = await db.Entrega.findByPk(entregaId);
  if (!entrega || entrega.status !== 'disponivel') return null;
  await entrega.update({ entregador_id: entregadorId, status: 'aceito' });
  return findById(entregaId);
}

async function updateStatus(id, status) {
  const entrega = await db.Entrega.findByPk(id);
  if (!entrega) return null;
  await entrega.update({ status });
  return findById(id);
}

module.exports = { findDisponiveis, findByEntregador, findById, aceitar, updateStatus };
