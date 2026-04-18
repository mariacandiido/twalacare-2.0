const express = require("express");
const adminController = require("../controllers/adminController");
const { authenticate, requireRoles } = require("../middlewares/auth");

const router = express.Router();

router.use(authenticate, requireRoles(["ADMIN"]));

// Farmácias
router.get("/farmacias", adminController.getFarmacias);
router.get("/farmacias/:id", adminController.getFarmaciaById);
router.patch("/farmacias/:id/approve", adminController.approveFarmacia);
router.patch("/farmacias/:id/reject", adminController.rejectFarmacia);
router.patch("/farmacias/:id/block", adminController.blockFarmacia);
router.patch("/farmacias/:id/unblock", adminController.unblockFarmacia);

// Entregadores
router.get("/entregadores", adminController.getEntregadores);
router.get("/entregadores/:id", adminController.getEntregadorById);
router.patch("/entregadores/:id/approve", adminController.approveEntregador);
router.patch("/entregadores/:id/reject", adminController.rejectEntregador);
router.patch("/entregadores/:id/block", adminController.blockEntregador);
router.patch("/entregadores/:id/unblock", adminController.unblockEntregador);

// Clientes
router.get("/clientes", adminController.getClientes);

// Usuários (gerenciamento geral)
router.get("/usuarios", adminController.getAllUsers);
router.get("/usuarios/:id", adminController.getUserById);
router.patch("/usuarios/:id/block", adminController.blockUser);
router.patch("/usuarios/:id/unblock", adminController.unblockUser);

// Administradores
router.get("/admins", adminController.listAdmins);
router.post("/admins", adminController.createAdmin);
router.delete("/admins/:id", adminController.removeAdmin);

// Logs administrativos
router.get("/logs", adminController.getAdminLogs);

// Pedidos
router.get("/pedidos", adminController.getPedidos);

// Dashboard & relatórios
router.get("/dashboard/metrics", adminController.getDashboardMetrics);
router.get("/reports", adminController.generateReport);

module.exports = router;
