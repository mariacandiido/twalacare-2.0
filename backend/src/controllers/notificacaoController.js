const notificacaoService = require('../services/notificacaoService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');

exports.getNotificacoes = catchAsync(async (req, res) => {
  const result = await notificacaoService.getNotificacoes(req.user.id);
  ApiResponse.success(res, 'Notificações lidas com sucesso', result);
});

exports.marcarComoLida = catchAsync(async (req, res) => {
  const result = await notificacaoService.marcarComoLida(req.user.id, req.params.id);
  ApiResponse.success(res, 'Sinalizado', result);
});
