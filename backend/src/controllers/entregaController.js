/**
 * Controller de entregas: listar disponíveis (entregador), minhas entregas, aceitar, atualizar status.
 */
const entregaRepository = require("../repositories/entregaRepository");
const asyncHandler = require("../utils/asyncHandler");

const listDisponiveis = asyncHandler(async (req, res) => {
  const list = await entregaRepository.findDisponiveis(
    parseInt(req.query.limit, 10) || 20,
  );
  res.json({ status: "success", data: { entregas: list } });
});

const listMinhas = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const { rows, count } = await entregaRepository.findByEntregador(
    req.userId,
    limit,
    offset,
  );
  res.json({
    status: "success",
    data: {
      entregas: rows,
      total: count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    },
  });
});

const aceitar = asyncHandler(async (req, res) => {
  const entrega = await entregaRepository.findById(req.params.id);
  if (!entrega || entrega.status !== "disponivel") {
    return res
      .status(400)
      .json({ status: "error", message: "Entrega não disponível" });
  }
  const result = await entregaRepository.aceitar(req.params.id, req.userId);
  res.json({ status: "success", data: { entrega: result } });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const entrega = await entregaRepository.findById(req.params.id);
  if (!entrega)
    return res
      .status(404)
      .json({ status: "error", message: "Entrega não encontrada" });
  if (entrega.entregador_id !== req.userId) {
    return res
      .status(403)
      .json({
        status: "error",
        message: "Entrega pertence a outro entregador",
      });
  }
  if (!["aceito", "em_transito", "entregue", "cancelado"].includes(status)) {
    return res
      .status(400)
      .json({ status: "error", message: "Status de entrega inválido" });
  }
  const updated = await entregaRepository.updateStatus(req.params.id, status);
  res.json({ status: "success", data: { entrega: updated } });
});

module.exports = { listDisponiveis, listMinhas, aceitar, updateStatus };
