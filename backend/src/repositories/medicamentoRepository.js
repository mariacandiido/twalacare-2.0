/**
 * Repositório de medicamentos: CRUD e listagem com filtros.
 */
const { Op } = require('sequelize');
const db = require('../database');

async function findAll(options = {}) {
  const { farmacia_id, categoria, provincia, busca, limit = 50, offset = 0 } = options;
  const where = { ativo: true };
  if (farmacia_id) where.farmacia_id = farmacia_id;
  if (categoria) where.categoria = categoria;
  if (provincia) where.provincia = provincia;
  if (busca) {
    where[Op.or] = [
      { nome: { [Op.like]: `%${busca}%` } },
      { descricao: { [Op.like]: `%${busca}%` } },
    ];
  }
  return db.Medicamento.findAndCountAll({
    where,
    limit,
    offset,
    include: [{ model: db.Farmacia, as: 'Farmacia', attributes: ['id', 'nome'] }],
    order: [['nome', 'ASC']],
  });
}

async function findById(id) {
  return db.Medicamento.findByPk(id, {
    include: [{ model: db.Farmacia, as: 'Farmacia' }],
  });
}

async function create(data) {
  return db.Medicamento.create(data);
}

async function update(id, data) {
  const med = await db.Medicamento.findByPk(id);
  if (!med) return null;
  await med.update(data);
  return med;
}

module.exports = { findAll, findById, create, update };
