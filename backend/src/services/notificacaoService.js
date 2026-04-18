const { prisma } = require('../lib/prisma');

exports.getNotificacoes = async (userId) => {
  return await prisma.notificacao.findMany({
    where: { user_id: userId },
    orderBy: { createdAt: 'desc' }
  });
};

exports.marcarComoLida = async (userId, id) => {
  const notif = await prisma.notificacao.findUnique({ where: { id: parseInt(id) } });
  if (!notif || notif.user_id !== userId) throw Object.assign(new Error('Acesso negado'), { status: 403 });
  
  return await prisma.notificacao.update({
    where: { id: parseInt(id) },
    data: { lida: true }
  });
};
