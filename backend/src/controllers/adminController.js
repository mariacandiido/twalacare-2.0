const adminService = require("../services/adminService");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/apiResponse");

exports.getFarmacias = catchAsync(async (req, res) => {
  const { status, page, limit } = req.query;
  const farmacias = await adminService.listFarmacias({ status, page, limit });
  ApiResponse.success(res, "Farmácias listadas", farmacias);
});

exports.getFarmaciaById = catchAsync(async (req, res) => {
  const farmacia = await adminService.getFarmaciaById(req.params.id);
  ApiResponse.success(res, "Farmácia encontrada", farmacia);
});

exports.approveFarmacia = catchAsync(async (req, res) => {
  const farmacia = await adminService.approveFarmacia(req.params.id);
  ApiResponse.success(res, "Farmácia aprovada com sucesso", farmacia);
});

exports.rejectFarmacia = catchAsync(async (req, res) => {
  const { motivo } = req.body;
  const farmacia = await adminService.rejectFarmacia(req.params.id, motivo);
  ApiResponse.success(res, "Farmácia rejeitada", farmacia);
});

exports.blockFarmacia = catchAsync(async (req, res) => {
  const farmacia = await adminService.blockFarmacia(req.params.id);
  ApiResponse.success(res, "Farmácia bloqueada", farmacia);
});

exports.unblockFarmacia = catchAsync(async (req, res) => {
  const farmacia = await adminService.unblockFarmacia(req.params.id);
  ApiResponse.success(res, "Farmácia desbloqueada", farmacia);
});

exports.getEntregadores = catchAsync(async (req, res) => {
  const { status, page, limit } = req.query;
  const entregadores = await adminService.listEntregadores({
    status,
    page,
    limit,
  });
  ApiResponse.success(res, "Entregadores listados", entregadores);
});

exports.getEntregadorById = catchAsync(async (req, res) => {
  const entregador = await adminService.getEntregadorById(req.params.id);
  ApiResponse.success(res, "Entregador encontrado", entregador);
});

exports.approveEntregador = catchAsync(async (req, res) => {
  const entregador = await adminService.approveEntregador(req.params.id);
  ApiResponse.success(res, "Entregador aprovado", entregador);
});

exports.rejectEntregador = catchAsync(async (req, res) => {
  const entregador = await adminService.rejectEntregador(req.params.id);
  ApiResponse.success(res, "Entregador rejeitado", entregador);
});

exports.blockEntregador = catchAsync(async (req, res) => {
  const entregador = await adminService.blockEntregador(req.params.id);
  ApiResponse.success(res, "Entregador bloqueado", entregador);
});

exports.unblockEntregador = catchAsync(async (req, res) => {
  const entregador = await adminService.unblockEntregador(req.params.id);
  ApiResponse.success(res, "Entregador desbloqueado", entregador);
});

exports.getClientes = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const clientes = await adminService.listClientes({ page, limit });
  ApiResponse.success(res, "Clientes listados", clientes);
});

exports.getPedidos = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const pedidos = await adminService.listPedidos({ page, limit });
  ApiResponse.success(res, "Pedidos listados", pedidos);
});

exports.getDashboardMetrics = catchAsync(async (req, res) => {
  const metrics = await adminService.getDashboardMetrics();
  ApiResponse.success(res, "Métricas do dashboard obtidas", metrics);
});

exports.generateReport = catchAsync(async (req, res) => {
  const { tipo } = req.query;
  const report = await adminService.generateReport({ tipo });
  ApiResponse.success(res, "Relatório gerado", report);
});

// Novos endpoints para gerenciamento de usuários

exports.getAllUsers = catchAsync(async (req, res) => {
  const { tipo, status, page, limit } = req.query;
  const result = await adminService.getAllUsers({ tipo, status, page, limit });
  ApiResponse.success(res, "Utilizadores listados", result);
});

exports.getUserById = catchAsync(async (req, res) => {
  const user = await adminService.getUserById(req.params.id);
  ApiResponse.success(res, "Utilizador encontrado", user);
});

exports.blockUser = catchAsync(async (req, res) => {
  const { motivo } = req.body;
  const user = await adminService.blockUser(req.params.id);

  // Registrar log
  await adminService.registerAdminLog({
    admin_id: req.userId,
    acao: "BLOQUEAR_USUARIO",
    tipo_alvo: "USUARIO",
    id_alvo: req.params.id,
    descricao: `Utilizador ${user.nome} bloqueado`,
    detalhes: { motivo },
    ip_address: req.ip,
  });

  ApiResponse.success(res, "Utilizador bloqueado com sucesso", user);
});

exports.unblockUser = catchAsync(async (req, res) => {
  const user = await adminService.unblockUser(req.params.id);

  // Registrar log
  await adminService.registerAdminLog({
    admin_id: req.userId,
    acao: "DESBLOQUEAR_USUARIO",
    tipo_alvo: "USUARIO",
    id_alvo: req.params.id,
    descricao: `Utilizador ${user.nome} desbloqueado`,
    detalhes: {},
    ip_address: req.ip,
  });

  ApiResponse.success(res, "Utilizador desbloqueado com sucesso", user);
});

exports.listAdmins = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await adminService.listAdmins({ page, limit });
  ApiResponse.success(res, "Administradores listados", result);
});

exports.createAdmin = catchAsync(async (req, res) => {
  const { nome, email, password_hash } = req.body;
  const admin = await adminService.createAdmin({ nome, email, password_hash });

  // Registrar log
  await adminService.registerAdminLog({
    admin_id: req.userId,
    acao: "CRIAR_ADMIN",
    tipo_alvo: "ADMIN",
    id_alvo: admin.id,
    descricao: `Novo administrador criado: ${admin.nome}`,
    detalhes: { email: admin.email },
    ip_address: req.ip,
  });

  ApiResponse.success(res, "Administrador criado com sucesso", admin);
});

exports.removeAdmin = catchAsync(async (req, res) => {
  const adminToRemove = await adminService.getUserById(req.params.id);
  const user = await adminService.removeAdmin(req.params.id);

  // Registrar log
  await adminService.registerAdminLog({
    admin_id: req.userId,
    acao: "REMOVER_ADMIN",
    tipo_alvo: "ADMIN",
    id_alvo: req.params.id,
    descricao: `Administrador ${adminToRemove.nome} removido`,
    detalhes: {},
    ip_address: req.ip,
  });

  ApiResponse.success(res, "Administrador removido com sucesso", user);
});

exports.getAdminLogs = catchAsync(async (req, res) => {
  const { page, limit, admin_id } = req.query;
  const result = await adminService.getAdminLogs({ page, limit, admin_id });
  ApiResponse.success(res, "Logs administrativos listados", result);
});
