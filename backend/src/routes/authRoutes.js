const express = require("express");
const authController = require("../controllers/authController");
const upload = require("../middlewares/upload");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.post("/register-cliente", authController.registerCliente);
router.post("/register-farmacia", authController.registerFarmacia);
router.post("/register-entregador", authController.registerEntregador);

router.post(
  "/register-farmacia-continue",
  upload.fields([
    { name: "docLicencaFunc", maxCount: 1 },
    { name: "docAlvara", maxCount: 1 },
    { name: "docRegistroComercial", maxCount: 1 },
    { name: "docLicencaSanitaria", maxCount: 1 },
    { name: "docNif", maxCount: 1 },
    { name: "docCedula", maxCount: 1 },
  ]),
  authController.completeFarmaciaRegistration,
);
router.post(
  "/register-entregador-continue",
  upload.fields([
    { name: "docBi", maxCount: 1 },
    { name: "docCarta", maxCount: 1 },
    { name: "docLivrete", maxCount: 1 },
    { name: "docFoto", maxCount: 1 },
  ]),
  authController.completeEntregadorRegistration,
);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

router.get("/me", authenticate, authController.me);
router.put("/profile", authenticate, authController.updateProfile);
router.put("/change-password", authenticate, authController.changePassword);

module.exports = router;
