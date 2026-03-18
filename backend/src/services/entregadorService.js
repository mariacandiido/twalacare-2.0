const { prisma } = require('../lib/prisma');

exports.updatePerfil = async (userId, data) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { veiculo: data.veiculo, placa_veiculo: data.placa_veiculo }
  });
};

exports.updateDisponibilidade = async (userId, isAvailable) => {
  // Poderiamos adicionar um campo "is_online" ao User? O schema nao o tem mas tem 'status'. 
  // O utilizador pode ser suspenso, ativo. Para gerir disponibilidade criaremos uma flag ou assumiremos disponibilidade via status
  return await prisma.user.update({
    where: { id: userId },
    data: { status: isAvailable ? 'ATIVO' : 'INATIVO' }
  });
};

exports.getPedidosAtribuidos = async (userId) => {
  return await prisma.entrega.findMany({
    where: { entregador_id: userId, status: { in: ['DISPONIVEL', 'ACEITO', 'COLETANDO'] } },
    include: { Pedido: { include: { Endereco: true, PedidoItems: true } } }
  });
};

exports.iniciarEntrega = async (userId, pedidoId) => {
  const entrega = await prisma.entrega.findUnique({ where: { pedido_id: parseInt(pedidoId) } });
  if (!entrega || entrega.entregador_id !== userId) throw Object.assign(new Error('Atribuição inválida ou não encontrada'), { status: 403 });

  await prisma.pedido.update({ where: { id: parseInt(pedidoId) }, data: { status: 'EM_TRANSITO' } });
  
  await prisma.historicoPedido.create({
    data: { pedido_id: parseInt(pedidoId), status_novo: 'EM_TRANSITO', observacao: 'Entregador assumiu a carga', atualizado_por: userId }
  });

  return await prisma.entrega.update({
    where: { id: entrega.id },
    data: { status: 'EM_TRANSITO' }
  });
};

exports.updateEntregaStatus = async (userId, pedidoId, statusMessage) => {
  // Apenas envia um update de status ou um log - por ex: O transito atrasou
  await prisma.historicoPedido.create({
    data: { pedido_id: parseInt(pedidoId), status_novo: 'EM_TRANSITO', observacao: statusMessage, atualizado_por: userId }
  });
  return { success: true };
};

exports.concluirEntrega = async (userId, pedidoId) => {
  const entrega = await prisma.entrega.findUnique({ where: { pedido_id: parseInt(pedidoId) } });
  if (!entrega || entrega.entregador_id !== userId) throw Object.assign(new Error('Permissão negada'), { status: 403 });

  await prisma.pedido.update({ where: { id: parseInt(pedidoId) }, data: { status: 'ENTREGUE', data_entrega: new Date() } });
  
  await prisma.historicoPedido.create({
    data: { pedido_id: parseInt(pedidoId), status_novo: 'ENTREGUE', observacao: 'Pacote entregue ao cliente final', atualizado_por: userId }
  });

  return await prisma.entrega.update({
    where: { id: entrega.id },
    data: { status: 'ENTREGUE' }
  });
};

exports.getHistorico = async (userId) => {
  return await prisma.entrega.findMany({
    where: { entregador_id: userId, status: 'ENTREGUE' },
    include: { Pedido: { include: { Endereco: true } } }
  });
};
