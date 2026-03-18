const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { prisma } = require('../lib/prisma');
const { sendWelcomeEmail } = require('./emailService');

const SALT_ROUNDS = 12;

function generateAccessToken(userId, tipo) {
  return jwt.sign({ userId, tipo }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
}

async function generateAndSaveRefreshToken(userId) {
  const token = jwt.sign({ userId, type: 'refresh' }, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn });
  const decoded = jwt.decode(token);
  
  await prisma.refreshToken.create({
    data: {
      user_id: userId,
      token,
      expires_at: new Date(decoded.exp * 1000)
    }
  });
  return token;
}

exports.register = async (body, userType) => {
  const { email, password, nome, telefone, nif, licenca_funcionamento, veiculo, placa_veiculo } = body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('Este email já está cadastrado');
    error.status = 409; throw error;
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  let status = 'ATIVO';
  if (userType === 'FARMACIA') status = 'PENDENTE_APROVACAO';

  const user = await prisma.user.create({
    data: {
      nome,
      email,
      password_hash,
      telefone,
      tipo: userType,
      status,
      veiculo: userType === 'ENTREGADOR' ? veiculo : null,
      placa_veiculo: userType === 'ENTREGADOR' ? placa_veiculo : null
    }
  });

  if (userType === 'FARMACIA') {
    await prisma.farmacia.create({
      data: {
        user_id: user.id,
        nome: body.nome_farmacia || nome,
        nif,
        licenca_funcionamento
      }
    });
  }

  const requiresApproval = status !== 'ATIVO';
  const accessToken = requiresApproval ? null : generateAccessToken(user.id, user.tipo);
  const refreshToken = requiresApproval ? null : await generateAndSaveRefreshToken(user.id);

  // Send welcome email asynchronously (does not block registration)
  sendWelcomeEmail({ email: user.email, nome: user.nome, tipo: user.tipo }).catch(() => {});

  const { password_hash: _pw, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    token: accessToken,
    refreshToken,
    requiresApproval
  };
};

exports.login = async (email, password) => {
  const user = await prisma.user.findUnique({ 
    where: { email },
    include: { Farmacia: true }
  });
  
  if (!user || user.status === 'INATIVO') {
    const err = new Error('Credenciais inválidas ou conta inativa'); err.status = 401; throw err;
  }
  
  if (user.status === 'PENDENTE_APROVACAO') {
    const err = new Error('Conta pendente de aprovação'); err.status = 403; throw err;
  }
  
  if (user.status === 'SUSPENSO') {
    const err = new Error('Conta suspensa'); err.status = 403; throw err;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Credenciais inválidas'); err.status = 401; throw err;
  }

  const accessToken = generateAccessToken(user.id, user.tipo);
  const refreshToken = await generateAndSaveRefreshToken(user.id);

  const { password_hash: _pw, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token: accessToken,
    refreshToken
  };
};

exports.refresh = async (refreshTokenValue) => {
  const row = await prisma.refreshToken.findFirst({
    where: { token: refreshTokenValue, revoked: false },
    include: { User: true }
  });

  if (!row || new Date() > new Date(row.expires_at)) {
    const err = new Error('Refresh token inválido ou expirado'); err.status = 401; throw err;
  }

  const newAccessToken = generateAccessToken(row.user_id, row.User.tipo);
  await prisma.refreshToken.update({ where: { id: row.id }, data: { revoked: true } });
  const newRefreshToken = await generateAndSaveRefreshToken(row.user_id);

  const { password_hash: _pw, ...userWithoutPassword } = row.User;
  
  return {
    user: userWithoutPassword,
    token: newAccessToken,
    refreshToken: newRefreshToken
  };
};

exports.logout = async (refreshTokenValue) => {
  if (refreshTokenValue) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshTokenValue },
      data: { revoked: true }
    });
  }
};

exports.getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { Farmacia: true, Enderecos: true }
  });
  const { password_hash: _pw, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

exports.updateProfile = async (userId, data) => {
  const { email, password, ...allowedUpdates } = data; // Prevent password injections
  const user = await prisma.user.update({
    where: { id: userId },
    data: allowedUpdates
  });
  const { password_hash: _pw, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const valid = await bcrypt.compare(oldPassword, user.password_hash);
  if (!valid) {
    const err = new Error('Senha antiga incorreta'); err.status = 400; throw err;
  }
  const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { password_hash } });
};

const crypto = require('crypto');
const { sendPasswordResetEmail } = require('./emailService');

exports.forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Para segurança, não revelamos se o e-mail existe ou não
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: token,
      resetPasswordExpires: expires
    }
  });

  await sendPasswordResetEmail({ email: user.email, nome: user.nome, token });
};

exports.resetPassword = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { gt: new Date() }
    }
  });

  if (!user) {
    const err = new Error('Token inválido ou expirado');
    err.status = 400;
    throw err;
  }

  const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password_hash,
      resetPasswordToken: null,
      resetPasswordExpires: null
    }
  });
};
