const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const prismaclient = require("@prisma/client");
const { PrismaClient } = prismaclient;
const prisma = new PrismaClient();

const UserStatus = prismaclient.UserStatus || {
  ATIVO: "ATIVO",
  INATIVO: "INATIVO",
  SUSPENSO: "SUSPENSO",
  PENDENTE: "PENDENTE",
  APROVADO: "APROVADO",
};

const UserType = prismaclient.UserType || {
  CLIENTE: "CLIENTE",
  FARMACIA: "FARMACIA",
  ENTREGADOR: "ENTREGADOR",
  ADMIN: "ADMIN",
};

const jwtConfig = require("../config/jwt");
const { sendWelcomeEmail, sendPasswordResetEmail } = require("./emailService");

const SALT_ROUNDS = 12;

// ================= TOKEN =================

function generateAccessToken(userId, tipo) {
  return jwt.sign({ userId, tipo }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
}

async function generateAndSaveRefreshToken(userId) {
  const token = jwt.sign({ userId, type: "refresh" }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });

  const decoded = jwt.decode(token);

  await prisma.refreshToken.create({
    data: {
      user_id: userId,
      token,
      expires_at: new Date(decoded.exp * 1000),
    },
  });

  return token;
}

// ================= DOCUMENTOS =================

function buildDocuments(userType, body, files = {}) {
  const documents = [];

  const addFile = (fieldName, label) => {
    const fileArray = files[fieldName];
    if (Array.isArray(fileArray) && fileArray[0]) {
      const file = fileArray[0];
      documents.push({
        label,
        fileName: file.originalname,
        url: `/uploads/documentos/${file.filename}`,
      });
    }
  };

  if (userType === "FARMACIA") {
    addFile("docLicencaFunc", "Licença de Funcionamento");
    addFile("docAlvara", "Alvará Comercial");
    addFile("docRegistroComercial", "Certificado de Registo Comercial");
    addFile("docLicencaSanitaria", "Licença Sanitária");
    addFile("docNif", "Documento do NIF");
    addFile("docCedula", "Cédula Profissional do Farmacêutico");
  }

  if (userType === "ENTREGADOR") {
    addFile("docBi", "Bilhete de Identidade (BI)");
    addFile("docCarta", "Carta de Condução");
    addFile("docLivrete", "Livrete");
    addFile("docFoto", "Fotografia do Entregador");
  }

  if (body.documentos && Array.isArray(body.documentos)) {
    documents.push(
      ...body.documentos
        .filter((doc) => doc && doc.label && doc.url)
        .map((doc) => ({
          label: doc.label,
          fileName: doc.fileName || doc.label,
          url: doc.url,
        })),
    );
  }

  return documents.length > 0 ? documents : null;
}

// ================= REGISTER =================

exports.register = async (body, userType, files = {}) => {
  const {
    email,
    password,
    nome,
    telefone,
    nif,
    licenca_funcionamento,
    veiculo,
    placa_veiculo,
  } = body;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    const error = new Error("Este email já está cadastrado");
    error.status = 409;
    throw error;
  }

  const normalizedUserType =
    typeof userType === "string" ? userType.toUpperCase() : userType;

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  let status = UserStatus.ATIVO;

  if (
    normalizedUserType === "FARMACIA" ||
    normalizedUserType === "ENTREGADOR"
  ) {
    status = UserStatus.PENDENTE;
  }

  const documentos = buildDocuments(normalizedUserType, body, files);

  const userData = {
    nome,
    email,
    password_hash,
    telefone,
    tipo: UserType[normalizedUserType] || normalizedUserType,
    status,
    veiculo: normalizedUserType === "ENTREGADOR" ? veiculo : null,
    placa_veiculo: normalizedUserType === "ENTREGADOR" ? placa_veiculo : null,
  };

  if (normalizedUserType === "ENTREGADOR") {
    userData.documentos = documentos;
  }

  const user = await prisma.user.create({
    data: userData,
  });

  if (normalizedUserType === "FARMACIA") {
    await prisma.farmacia.create({
      data: {
        user_id: user.id,
        nome: body.nome_farmacia || nome,
        nif,
        licenca_funcionamento,
        documentos,
      },
    });
  }

  const requiresApproval = status !== UserStatus.ATIVO;

  const accessToken = requiresApproval
    ? null
    : generateAccessToken(user.id, user.tipo);

  const refreshToken = requiresApproval
    ? null
    : await generateAndSaveRefreshToken(user.id);

  sendWelcomeEmail({
    email: user.email,
    nome: user.nome,
    tipo: user.tipo,
  }).catch(() => {});

  const { password_hash: _pw, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token: accessToken,
    refreshToken,
    requiresApproval,
  };
};

// ================= COMPLETE FARMACIA =================

exports.completeFarmaciaRegistration = async (body, files = {}) => {
  const { email, password } = body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.tipo !== "FARMACIA") {
    const err = new Error("Utilizador de farmácia não encontrado");
    err.status = 404;
    throw err;
  }

  if (user.status !== UserStatus.PENDENTE) {
    const err = new Error(
      "Cadastro já foi finalizado ou a conta não está pendente",
    );
    err.status = 400;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    const err = new Error("Credenciais inválidas");
    err.status = 401;
    throw err;
  }

  const farmacia = await prisma.farmacia.update({
    where: { user_id: user.id },
    data: {
      nome: body.nomeEmpresa || body.nome_farmacia || user.nome,
      nif: body.nif || undefined,
      licenca_funcionamento:
        body.licencaFunc || body.licenca_funcionamento || undefined,
      horario_abertura:
        body.horarioAbertura || body.horario_abertura || undefined,
      horario_fechamento:
        body.horarioFechamento || body.horario_fechamento || undefined,
      farmaceutico_nome: body.farmNome || undefined,
      farmaceutico_cedula: body.farmCedula || undefined,
      farmaceutico_tel: body.farmTel || undefined,
      documentos: buildDocuments("FARMACIA", body, files),
    },
  });

  return farmacia;
};

// ================= COMPLETE ENTREGADOR =================

exports.completeEntregadorRegistration = async (body, files = {}) => {
  const { email, password } = body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.tipo !== "ENTREGADOR") {
    const err = new Error("Utilizador entregador não encontrado");
    err.status = 404;
    throw err;
  }

  if (user.status !== UserStatus.PENDENTE) {
    const err = new Error(
      "Cadastro já foi finalizado ou a conta não está pendente",
    );
    err.status = 400;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    const err = new Error("Credenciais inválidas");
    err.status = 401;
    throw err;
  }

  const userData = {
    nome: body.nome || user.nome,
    telefone: body.telefone || user.telefone || undefined,
    data_nascimento: body.dataNasc
      ? new Date(body.dataNasc)
      : user.data_nascimento,
    veiculo:
      body.marcaMoto && body.modeloMoto
        ? `${body.marcaMoto} ${body.modeloMoto}`
        : user.veiculo,
    placa_veiculo: body.matricula || user.placa_veiculo,
    documentos: buildDocuments("ENTREGADOR", body, files),
  };

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: userData,
  });

  const { password_hash: _pw, ...userWithoutPassword } = updatedUser;

  return userWithoutPassword;
};

// ================= LOGIN =================

exports.login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { Farmacia: true },
  });

  if (!user) {
    const err = new Error("Credenciais inválidas");
    err.status = 401;
    throw err;
  }

  if (user.status === UserStatus.INATIVO) {
    const err = new Error("Conta inativa");
    err.status = 403;
    throw err;
  }

  if (user.status === UserStatus.SUSPENSO) {
    const err = new Error("Conta suspensa");
    err.status = 403;
    throw err;
  }

  if (
    (user.tipo === "FARMACIA" || user.tipo === "ENTREGADOR") &&
    user.status === UserStatus.PENDENTE
  ) {
    const err = new Error("Conta pendente de aprovação");
    err.status = 403;
    throw err;
  }

  if (user.tipo === "CLIENTE" && user.status !== UserStatus.ATIVO) {
    const err = new Error("Conta de cliente não está ativa");
    err.status = 403;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    const err = new Error("Credenciais inválidas");
    err.status = 401;
    throw err;
  }

  const accessToken = generateAccessToken(user.id, user.tipo);

  const refreshToken = await generateAndSaveRefreshToken(user.id);

  const { password_hash: _pw, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token: accessToken,
    refreshToken,
  };
};

// ================= REFRESH =================

exports.refresh = async (refreshTokenValue) => {
  const row = await prisma.refreshToken.findFirst({
    where: {
      token: refreshTokenValue,
      revoked: false,
    },
    include: { User: true },
  });

  if (!row || new Date() > new Date(row.expires_at)) {
    const err = new Error("Refresh token inválido ou expirado");
    err.status = 401;
    throw err;
  }

  const newAccessToken = generateAccessToken(row.user_id, row.User.tipo);

  await prisma.refreshToken.update({
    where: { id: row.id },
    data: { revoked: true },
  });

  const newRefreshToken = await generateAndSaveRefreshToken(row.user_id);

  const { password_hash: _pw, ...userWithoutPassword } = row.User;

  return {
    user: userWithoutPassword,
    token: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// ================= LOGOUT =================

exports.logout = async (refreshTokenValue) => {
  if (refreshTokenValue) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshTokenValue },
      data: { revoked: true },
    });
  }
};

// ================= PROFILE =================

exports.getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { Farmacia: true, Enderecos: true },
  });

  const { password_hash: _pw, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

exports.updateProfile = async (userId, data) => {
  const { email, password, ...allowedUpdates } = data;

  const user = await prisma.user.update({
    where: { id: userId },
    data: allowedUpdates,
  });

  const { password_hash: _pw, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

// ================= PASSWORD =================

exports.changePassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const valid = await bcrypt.compare(oldPassword, user.password_hash);

  if (!valid) {
    const err = new Error("Senha antiga incorreta");
    err.status = 400;
    throw err;
  }

  const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { password_hash },
  });
};

// ================= FORGOT PASSWORD =================

exports.forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");

  const expires = new Date(Date.now() + 30 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    },
  });

  await sendPasswordResetEmail({
    email: user.email,
    nome: user.nome,
    token,
  });
};

// ================= RESET PASSWORD =================

exports.resetPassword = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { gt: new Date() },
    },
  });

  if (!user) {
    const err = new Error("Token inválido ou expirado");
    err.status = 400;
    throw err;
  }

  const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password_hash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });
};
