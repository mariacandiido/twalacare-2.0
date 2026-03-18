const farmaciaService = require('../services/farmaciaService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');

exports.updatePerfil = catchAsync(async (req, res) => {
  const result = await farmaciaService.updatePerfil(req.user.id, req.body);
  ApiResponse.success(res, 'Perfil da farmácia atualizado', result);
});

exports.getMedicamentos = catchAsync(async (req, res) => {
  const result = await farmaciaService.getMedicamentos(req.user.id);
  ApiResponse.success(res, 'Catálogo obtido', result);
});

exports.createMedicamento = catchAsync(async (req, res) => {
  const filename = req.file ? req.file.filename : null;
  const result = await farmaciaService.createMedicamento(req.user.id, req.body, filename);
  ApiResponse.success(res, 'Medicamento catalogado', result, 201);
});

exports.updateMedicamento = catchAsync(async (req, res) => {
  const filename = req.file ? req.file.filename : null;
  const result = await farmaciaService.updateMedicamento(req.user.id, req.params.id, req.body, filename);
  ApiResponse.success(res, 'Medicamento modificado e salvo', result);
});

exports.deleteMedicamento = catchAsync(async (req, res) => {
  await farmaciaService.deleteMedicamento(req.user.id, req.params.id);
  ApiResponse.success(res, 'Medicamento arquivado');
});

exports.getPedidosPendentes = catchAsync(async (req, res) => {
  const result = await farmaciaService.getPedidosPendentes(req.user.id);
  ApiResponse.success(res, 'Fila de pedidos', result);
});

exports.getPedidoDetalhes = catchAsync(async (req, res) => {
  const result = await farmaciaService.getPedidoDetalhes(req.user.id, req.params.id);
  ApiResponse.success(res, 'Ticket carregado', result);
});

exports.updatePedidoStatus = catchAsync(async (req, res) => {
  const result = await farmaciaService.updatePedidoStatus(req.user.id, req.params.id, req.body.status, req.body.observacao);
  ApiResponse.success(res, 'Status de progressão de compra avançado', result);
});

exports.verificarReceita = catchAsync(async (req, res) => {
  const result = await farmaciaService.verificarReceita(req.user.id, req.params.id, req.body.valid);
  ApiResponse.success(res, 'Triagem de guias do utente submetida', result);
});

exports.getEntregadores = catchAsync(async (req, res) => {
  const result = await farmaciaService.getEntregadores();
  ApiResponse.success(res, 'Rede livre', result);
});

exports.atribuirEntregador = catchAsync(async (req, res) => {
  const result = await farmaciaService.atribuirEntregador(req.user.id, req.params.id, req.body.entregador_id);
  ApiResponse.success(res, 'Logística destacada para coleta do pacote', result);
});

exports.getHistoricoPedidos = catchAsync(async (req, res) => {
  const result = await farmaciaService.getHistoricoPedidos(req.user.id);
  ApiResponse.success(res, 'Estatisticas resolvidas de vendas', result);
});
