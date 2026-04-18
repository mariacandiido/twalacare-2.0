const clienteService = require('../services/clienteService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');

exports.getFarmacias = catchAsync(async (req, res) => {
  const result = await clienteService.getFarmacias();
  ApiResponse.success(res, 'Farmácias carregadas', result);
});

exports.getMedicamentos = catchAsync(async (req, res) => {
  const { q } = req.query;
  const result = await clienteService.getMedicamentos(q);
  ApiResponse.success(res, 'Medicamentos carregados', result);
});

exports.getEnderecos = catchAsync(async (req, res) => {
  const result = await clienteService.getEnderecos(req.user.id);
  ApiResponse.success(res, 'Endereços carregados', result);
});

exports.createEndereco = catchAsync(async (req, res) => {
  const result = await clienteService.createEndereco(req.user.id, req.body);
  ApiResponse.success(res, 'Endereço criado', result, 201);
});

exports.createPedido = catchAsync(async (req, res) => {
  const result = await clienteService.createPedido(req.user.id, req.body);
  ApiResponse.success(res, 'Pedido e Checkout gerados com sucesso', result, 201);
});

exports.getHistoricoPedidos = catchAsync(async (req, res) => {
  const result = await clienteService.getHistoricoPedidos(req.user.id);
  ApiResponse.success(res, 'Histórico de pedidos carregado', result);
});

exports.getEstatusPedido = catchAsync(async (req, res) => {
  const result = await clienteService.getEstatusPedido(req.user.id, req.params.id);
  ApiResponse.success(res, 'Status obtido', result);
});

exports.uploadReceita = catchAsync(async (req, res) => {
  if (!req.file) return ApiResponse.error(res, 'Ficheiro da receita não foi providenciado', null, 400);
  const result = await clienteService.uploadReceita(req.user.id, req.params.id, req.file.filename);
  ApiResponse.success(res, 'Receita enviada com sucesso', result, 201);
});

exports.createAvaliacao = catchAsync(async (req, res) => {
  const result = await clienteService.createAvaliacao(req.user.id, req.body);
  ApiResponse.success(res, 'Obrigado pela sua avaliação', result, 201);
});
