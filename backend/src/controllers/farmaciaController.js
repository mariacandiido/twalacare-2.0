const farmaciaService = require("../services/farmaciaService");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/apiResponse");

// ================= HELPERS =================

const validateUser = (req) => {
  if (!req.user || !req.user.id) {
    const err = new Error("Utilizador não autenticado");
    err.status = 401;
    throw err;
  }
};

const validateId = (id) => {
  if (!id) {
    const err = new Error("ID não fornecido");
    err.status = 400;
    throw err;
  }
  return id;
};

const pick = (obj, fields) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => fields.includes(key))
  );
};

// ================= PERFIL =================

exports.updatePerfil = catchAsync(async (req, res) => {
  validateUser(req);

  const data = pick(req.body, [
    "nome",
    "telefone",
    "endereco",
    "descricao",
  ]);

  const result = await farmaciaService.updatePerfil(req.user.id, data);

  ApiResponse.success(res, "Perfil da farmácia atualizado", result);
});

// ================= MEDICAMENTOS =================

exports.getMedicamentos = catchAsync(async (req, res) => {
  validateUser(req);

  const result = await farmaciaService.getMedicamentos(req.user.id);

  ApiResponse.success(res, "Catálogo obtido", result);
});

exports.createMedicamento = catchAsync(async (req, res) => {
  validateUser(req);

  const filename = req.file?.filename || null;

  const data = pick(req.body, [
    "nome",
    "descricao",
    "preco",
    "estoque",
    "categoria",
  ]);

  const result = await farmaciaService.createMedicamento(
    req.user.id,
    data,
    filename
  );

  ApiResponse.success(res, "Medicamento catalogado", result, 201);
});

exports.updateMedicamento = catchAsync(async (req, res) => {
  validateUser(req);

  const id = validateId(req.params.id);
  const filename = req.file?.filename || null;

  const data = pick(req.body, [
    "nome",
    "descricao",
    "preco",
    "estoque",
    "categoria",
  ]);

  const result = await farmaciaService.updateMedicamento(
    req.user.id,
    id,
    data,
    filename
  );

  ApiResponse.success(res, "Medicamento atualizado com sucesso", result);
});

exports.deleteMedicamento = catchAsync(async (req, res) => {
  validateUser(req);

  const id = validateId(req.params.id);

  await farmaciaService.deleteMedicamento(req.user.id, id);

  ApiResponse.success(res, "Medicamento removido com sucesso");
});

// ================= PEDIDOS =================

exports.getPedidosPendentes = catchAsync(async (req, res) => {
  validateUser(req);

  const result = await farmaciaService.getPedidosPendentes(req.user.id);

  ApiResponse.success(res, "Pedidos pendentes obtidos", result);
});

exports.getPedidoDetalhes = catchAsync(async (req, res) => {
  validateUser(req);

  const id = validateId(req.params.id);

  const result = await farmaciaService.getPedidoDetalhes(
    req.user.id,
    id
  );

  ApiResponse.success(res, "Detalhes do pedido carregados", result);
});

exports.updatePedidoStatus = catchAsync(async (req, res) => {
  validateUser(req);

  const id = validateId(req.params.id);
  const { status, observacao } = req.body;

  if (!status) {
    const err = new Error("Status é obrigatório");
    err.status = 400;
    throw err;
  }

  const result = await farmaciaService.updatePedidoStatus(
    req.user.id,
    id,
    status,
    observacao
  );

  ApiResponse.success(res, "Status do pedido atualizado", result);
});

exports.verificarReceita = catchAsync(async (req, res) => {
  validateUser(req);

  const id = validateId(req.params.id);
  const { valid } = req.body;

  if (typeof valid !== "boolean") {
    const err = new Error("Valor de validação inválido");
    err.status = 400;
    throw err;
  }

  const result = await farmaciaService.verificarReceita(
    req.user.id,
    id,
    valid
  );

  ApiResponse.success(res, "Receita verificada com sucesso", result);
});

// ================= ENTREGADORES =================

exports.getEntregadores = catchAsync(async (req, res) => {
  validateUser(req);

  const result = await farmaciaService.getEntregadores();

  ApiResponse.success(res, "Entregadores disponíveis", result);
});

exports.atribuirEntregador = catchAsync(async (req, res) => {
  validateUser(req);

  const id = validateId(req.params.id);
  const { entregador_id } = req.body;

  if (!entregador_id) {
    const err = new Error("ID do entregador é obrigatório");
    err.status = 400;
    throw err;
  }

  const result = await farmaciaService.atribuirEntregador(
    req.user.id,
    id,
    entregador_id
  );

  ApiResponse.success(res, "Entregador atribuído com sucesso", result);
});

// ================= HISTÓRICO =================

exports.getHistoricoPedidos = catchAsync(async (req, res) => {
  validateUser(req);

  const result = await farmaciaService.getHistoricoPedidos(
    req.user.id
  );

  ApiResponse.success(res, "Histórico de pedidos obtido", result);
});