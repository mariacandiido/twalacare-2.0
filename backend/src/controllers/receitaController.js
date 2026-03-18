/**
 * Controller de receitas: criar (cliente), listar (cliente/farmácia), aprovar/rejeitar (farmácia).
 */
const db = require("../database");
const receitaRepository = require("../repositories/receitaRepository");
const asyncHandler = require("../utils/asyncHandler");

const create = asyncHandler(async (req, res) => {
  const { pedido_id, farmacia_id, ficheiro_url, nome_ficheiro } = req.body;
  const receita = await receitaRepository.create({
    cliente_id: req.userId,
    pedido_id: pedido_id || null,
    farmacia_id: farmacia_id || null,
    ficheiro_url: ficheiro_url || null,
    nome_ficheiro: nome_ficheiro || null,
    estado: "pendente",
  });
  res.status(201).json({ status: "success", data: { receita } });
});

const listMy = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const { rows, count } = await receitaRepository.findByCliente(
    req.userId,
    limit,
    offset,
  );
  res.json({
    status: "success",
    data: {
      receitas: rows,
      total: count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    },
  });
});

const listFarmacia = asyncHandler(async (req, res) => {
  const farmacia = await db.Farmacia.findOne({
    where: { user_id: req.userId },
  });
  if (!farmacia)
    return res
      .status(404)
      .json({ status: "error", message: "Farmácia não encontrada" });
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const { rows, count } = await receitaRepository.findByFarmacia(
    farmacia.id,
    limit,
    offset,
  );
  res.json({
    status: "success",
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
  const farmacia = await db.Farmacia.findOne({
    where: { user_id: req.userId },
  });
  if (!farmacia)
    return res
      .status(404)
      .json({ status: "error", message: "Farmácia não encontrada" });
  const receitaAtual = await db.Receita.findByPk(req.params.id);
  if (!receitaAtual)
    return res
      .status(404)
      .json({ status: "error", message: "Receita não encontrada" });
  if (receitaAtual.farmacia_id !== farmacia.id) {
    return res
      .status(403)
      .json({
        status: "error",
        message: "Não pode alterar receita de outra farmácia",
      });
  }
  if (!["pendente", "aprovada", "rejeitada"].includes(estado)) {
    return res
      .status(400)
      .json({ status: "error", message: "Estado inválido" });
  }
  const receita = await receitaRepository.updateEstado(
    req.params.id,
    estado,
    observacoes,
  );
  res.json({ status: "success", data: { receita } });
});

module.exports = { create, listMy, listFarmacia, updateEstado };
