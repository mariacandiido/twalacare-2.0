/**
 * Controller de receitas: criar (cliente), listar (cliente/farmácia), aprovar/rejeitar (farmácia).
 */
const { prisma } = require('../lib/prisma');
const receitaRepository = require('../repositories/receitaRepository');
const asyncHandler = require('../utils/asyncHandler');

const create = asyncHandler(async (req, res) => {
  const { pedido_id, farmacia_id, ficheiro_url, nome_ficheiro } = req.body;
  const receita = await receitaRepository.create({
    cliente_id: req.userId,
    pedido_id: pedido_id ? parseInt(pedido_id, 10) : null,
    farmacia_id: farmacia_id ? parseInt(farmacia_id, 10) : null,
    ficheiro_url: ficheiro_url || null,
    nome_ficheiro: nome_ficheiro || null,
    estado: 'PENDENTE',
  });
  res.status(201).json({ status: 'success', data: { receita } });
});

const listMy = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const { rows, count } = await receitaRepository.findByCliente(
    req.userId,
    parseInt(limit, 10),
    offset,
  );
  res.json({
    status: 'success',
    data: {
      receitas: rows,
      total: count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    },
  });
});

const listFarmacia = asyncHandler(async (req, res) => {
  const farmacia = await prisma.farmacia.findUnique({
    where: { user_id: req.userId },
  });
  if (!farmacia) return res.status(404).json({ status: 'error', message: 'Farmácia não encontrada' });
  const { page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const { rows, count } = await receitaRepository.findByFarmacia(
    farmacia.id,
    parseInt(limit, 10),
    offset,
  );
  res.json({
    status: 'success',
    data: {
      receitas: rows,
      total: count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    },
  });
});

const updateEstado = asyncHandler(async (req, res) => {
  const { estado, observacoes } = req.body;
  const farmacia = await prisma.farmacia.findUnique({
    where: { user_id: req.userId },
  });
  if (!farmacia) return res.status(404).json({ status: 'error', message: 'Farmácia não encontrada' });

  const receitaAtual = await prisma.receita.findUnique({
    where: { id: parseInt(req.params.id, 10) },
  });
  if (!receitaAtual) return res.status(404).json({ status: 'error', message: 'Receita não encontrada' });
  if (receitaAtual.farmacia_id !== farmacia.id) {
    return res.status(403).json({ status: 'error', message: 'Não pode alterar receita de outra farmácia' });
  }

  const allowedStates = ['PENDENTE', 'APROVADA', 'REJEITADA'];
  if (!allowedStates.includes(estado.toUpperCase())) {
    return res.status(400).json({ status: 'error', message: 'Estado inválido' });
  }

  const receita = await receitaRepository.updateEstado(
    req.params.id,
    estado.toUpperCase(),
    observacoes,
  );
  res.json({ status: 'success', data: { receita } });
});

module.exports = { create, listMy, listFarmacia, updateEstado };
