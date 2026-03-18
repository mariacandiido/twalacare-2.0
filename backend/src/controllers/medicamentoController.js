/**
 * Controller de medicamentos: listar (público), obter por id, CRUD (farmácia/admin).
 */
const medicamentoRepository = require("../repositories/medicamentoRepository");
const farmaciaRepository = require("../repositories/farmaciaRepository");
const asyncHandler = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const {
    farmacia_id,
    categoria,
    provincia,
    busca,
    page = 1,
    limit = 20,
  } = req.query;
  const offset =
    (Math.max(1, parseInt(page, 10)) - 1) * (parseInt(limit, 10) || 20);
  const { rows, count } = await medicamentoRepository.findAll({
    farmacia_id,
    categoria,
    provincia,
    busca,
    limit: parseInt(limit, 10) || 20,
    offset,
  });
  res.json({
    status: "success",
    data: {
      medicamentos: rows,
      total: count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10) || 20,
    },
  });
});

const getById = asyncHandler(async (req, res) => {
  const medicamento = await medicamentoRepository.findById(req.params.id);
  if (!medicamento)
    return res
      .status(404)
      .json({ status: "error", message: "Medicamento não encontrado" });
  res.json({ status: "success", data: { medicamento } });
});

const create = asyncHandler(async (req, res) => {
  let payload = { ...req.body };
  if (req.user.tipo === "farmacia") {
    const farmacia = await farmaciaRepository.findByUserId(req.userId);
    if (!farmacia)
      return res
        .status(400)
        .json({
          status: "error",
          message: "Farmácia não encontrada para este usuário",
        });
    payload.farmacia_id = farmacia.id;
  }
  const medicamento = await medicamentoRepository.create(payload);
  res.status(201).json({ status: "success", data: { medicamento } });
});

const update = asyncHandler(async (req, res) => {
  if (req.user.tipo === "farmacia") {
    const farmacia = await farmaciaRepository.findByUserId(req.userId);
    if (!farmacia)
      return res
        .status(400)
        .json({
          status: "error",
          message: "Farmácia não encontrada para este usuário",
        });
    const med = await medicamentoRepository.findById(req.params.id);
    if (!med)
      return res
        .status(404)
        .json({ status: "error", message: "Medicamento não encontrado" });
    if (med.farmacia_id !== farmacia.id) {
      return res
        .status(403)
        .json({
          status: "error",
          message: "Não pode atualizar medicamento de outra farmácia",
        });
    }
  }
  const medicamento = await medicamentoRepository.update(
    req.params.id,
    req.body,
  );
  if (!medicamento)
    return res
      .status(404)
      .json({ status: "error", message: "Medicamento não encontrado" });
  res.json({ status: "success", data: { medicamento } });
});

module.exports = { list, getById, create, update };
