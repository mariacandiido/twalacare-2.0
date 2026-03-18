/**
 * Repositório de receitas: criar, listar por cliente/farmácia, atualizar estado.
 */
const db = require('../database');

async function create(data) {
  return db.Receita.create(data);
}

async function findByCliente(clienteId, limit = 50, offset = 0) {
  return db.Receita.findAndCountAll({
    where: { cliente_id: clienteId },
    limit,
    offset,
    order: [['created_at', 'DESC']],
  });
}

async function findByFarmacia(farmaciaId, limit = 50, offset = 0) {
  return db.Receita.findAndCountAll({
    where: { farmacia_id: farmaciaId },
    limit,
    offset,
    order: [['created_at', 'DESC']],
  });
}

async function updateEstado(id, estado, observacoes) {
  const rec = await db.Receita.findByPk(id);
  if (!rec) return null;
  await rec.update({ estado, observacoes: observacoes || null });
  return rec;
}

module.exports = { create, findByCliente, findByFarmacia, updateEstado };
