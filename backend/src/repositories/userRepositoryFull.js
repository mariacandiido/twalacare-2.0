/**
 * Repositório estendido: listar utilizadores (admin), atualizar perfil.
 */
const db = require('../database');

async function findAll(options = {}) {
  const { tipo, status, limit = 50, offset = 0 } = options;
  const where = {};
  if (tipo) where.tipo = tipo;
  if (status) where.status = status;
  return db.User.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']],
    include: [{ model: db.Farmacia, as: 'Farmacia', required: false }],
  });
}

async function update(id, data) {
  const user = await db.User.findByPk(id);
  if (!user) return null;
  const allowed = [
    'nome', 'telefone', 'data_nascimento', 'provincia', 'municipio', 'endereco',
    'veiculo', 'placa_veiculo', 'cargo', 'departamento', 'status',
  ];
  const toSet = {};
  allowed.forEach((k) => {
    if (data[k] !== undefined) toSet[k] = data[k];
  });
  await user.update(toSet);
  return user;
}

module.exports = { findAll, update };
