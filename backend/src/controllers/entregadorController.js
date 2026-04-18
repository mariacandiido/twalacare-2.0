const entregadorService = require('../services/entregadorService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');

exports.updatePerfil = catchAsync(async (req, res) => {
  const result = await entregadorService.updatePerfil(req.user.id, req.body);
  ApiResponse.success(res, 'Perfil do estafeta atualizado', result);
});

exports.updateDisponibilidade = catchAsync(async (req, res) => {
  const result = await entregadorService.updateDisponibilidade(req.user.id, req.body.isAvailable);
  ApiResponse.success(res, 'Status de online/offline trocado', result);
});

exports.getPedidosAtribuidos = catchAsync(async (req, res) => {
  const result = await entregadorService.getPedidosAtribuidos(req.user.id);
  ApiResponse.success(res, 'Rotas de hoje carregadas', result);
});

exports.iniciarEntrega = catchAsync(async (req, res) => {
  const result = await entregadorService.iniciarEntrega(req.user.id, req.params.id);
  ApiResponse.success(res, 'Rota ativada em trânsito', result);
});

exports.updateEntregaStatus = catchAsync(async (req, res) => {
  const result = await entregadorService.updateEntregaStatus(req.user.id, req.params.id, req.body.statusMessage);
  ApiResponse.success(res, 'Ocorrência reportada ao cliente e farmácia', result);
});

exports.concluirEntrega = catchAsync(async (req, res) => {
  const result = await entregadorService.concluirEntrega(req.user.id, req.params.id);
  ApiResponse.success(res, 'Missão cumprida com sucesso', result);
});

exports.getHistorico = catchAsync(async (req, res) => {
  const result = await entregadorService.getHistorico(req.user.id);
  ApiResponse.success(res, 'A listar as últimas prestações', result);
});
