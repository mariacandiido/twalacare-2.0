/**
 * Controller de utilizadores: listar (admin), obter por id, atualizar perfil.
 */
const db = require('../database');
const userRepositoryFull = require('../repositories/userRepositoryFull');
const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate, requireRoles } = require('../middlewares/auth');

const getMe = asyncHandler(async (req, res) => {
  const user = await db.User.findByPk(req.userId, {
    include: [{ model: db.Farmacia, as: 'Farmacia', required: false }],
  });
  if (!user) return res.status(404).json({ status: 'error', message: 'Utilizador não encontrado' });
  res.json({ status: 'success', data: { user: authService.toUserResponse(user) } });
});

const updateMe = asyncHandler(async (req, res) => {
  const updated = await userRepositoryFull.update(req.userId, req.body);
  if (!updated) return res.status(404).json({ status: 'error', message: 'Utilizador não encontrado' });
  const user = await db.User.findByPk(updated.id, {
    include: [{ model: db.Farmacia, as: 'Farmacia', required: false }],
  });
  res.json({ status: 'success', data: { user: authService.toUserResponse(user) } });
});

const listUsers = asyncHandler(async (req, res) => {
  const { tipo, status, page = 1, limit = 20 } = req.query;
  const offset = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(100, parseInt(limit, 10) || 20);
  const { rows, count } = await userRepositoryFull.findAll({
    tipo,
    status,
    limit: Math.min(100, parseInt(limit, 10) || 20),
    offset,
  });
  const users = rows.map((u) => authService.toUserResponse(u));
  res.json({
    status: 'success',
    data: { users, total: count, page: parseInt(page, 10), limit: parseInt(limit, 10) || 20 },
  });
});

const getById = asyncHandler(async (req, res) => {
  const user = await db.User.findByPk(req.params.id, {
    include: [{ model: db.Farmacia, as: 'Farmacia', required: false }],
  });
  if (!user) return res.status(404).json({ status: 'error', message: 'Utilizador não encontrado' });
  res.json({ status: 'success', data: { user: authService.toUserResponse(user) } });
});

module.exports = {
  getMe,
  updateMe,
  listUsers,
  getById,
};
