const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');

exports.registerCliente = catchAsync(async (req, res) => {
  const result = await authService.register(req.body, 'CLIENTE');
  ApiResponse.success(res, 'Cliente registado com sucesso', result, 201);
});

exports.registerFarmacia = catchAsync(async (req, res) => {
  const result = await authService.register(req.body, 'FARMACIA');
  ApiResponse.success(res, 'Farmácia registada com sucesso (pendente de aprovação)', result, 201);
});

exports.registerEntregador = catchAsync(async (req, res) => {
  const result = await authService.register(req.body, 'ENTREGADOR');
  ApiResponse.success(res, 'Entregador registado com sucesso', result, 201);
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return ApiResponse.error(res, 'Email e senha são obrigatórios', null, 400);
  
  const result = await authService.login(email, password);
  ApiResponse.success(res, 'Login efetuado com sucesso', result);
});

exports.refresh = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return ApiResponse.error(res, 'Token ausente', null, 400);
  const result = await authService.refresh(refreshToken);
  ApiResponse.success(res, 'Token renovado', result);
});

exports.logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  ApiResponse.success(res, 'Logout efetuado com sucesso');
});

exports.me = catchAsync(async (req, res) => {
  const result = await authService.getProfile(req.user.id);
  ApiResponse.success(res, 'Perfil obtido com sucesso', result);
});

exports.updateProfile = catchAsync(async (req, res) => {
  const result = await authService.updateProfile(req.user.id, req.body);
  ApiResponse.success(res, 'Perfil atualizado', result);
});

exports.changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return ApiResponse.error(res, 'Senhas não informadas', null, 400);
  
  await authService.changePassword(req.user.id, oldPassword, newPassword);
  ApiResponse.success(res, 'Senha atualizada com sucesso');
});

exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) return ApiResponse.error(res, 'E-mail é obrigatório', null, 400);
  
  await authService.forgotPassword(email);
  // Sempre retornamos sucesso para não dar dicas sobre existência de e-mail
  ApiResponse.success(res, 'Se o e-mail estiver associado a uma conta, um link de recuperação foi enviado.');
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return ApiResponse.error(res, 'Token e nova senha são obrigatórios', null, 400);
  
  await authService.resetPassword(token, newPassword);
  ApiResponse.success(res, 'Sua senha foi atualizada com sucesso. Agora você pode fazer login novamente.');
});
