const { prisma } = require('../lib/prisma');

// Auxiliar: Extrair id_farmacia a partir do req.user.id
async function getFarmaciaId(userId) {
  const farmacia = await prisma.farmacia.findUnique({ where: { user_id: userId } });
  if (!farmacia) throw Object.assign(new Error('Conta de Farmácia não configurada no registo'), { status: 404 });
  return farmacia.id;
}

exports.updatePerfil = async (userId, data) => {
  const farmaciaId = await getFarmaciaId(userId);
  return await prisma.farmacia.update({
    where: { id: farmaciaId },
    data
  });
};

exports.getMedicamentos = async (userId) => {
  const farmaciaId = await getFarmaciaId(userId);
  return await prisma.medicamento.findMany({
    where: { farmacia_id: farmaciaId, ativo: true },
    include: { Categoria: true }
  });
};

exports.createMedicamento = async (userId, data, fileName) => {
  const farmaciaId = await getFarmaciaId(userId);
  return await prisma.medicamento.create({
    data: {
      ...data,
      farmacia_id: farmaciaId,
      preco: Number(data.preco),
      stock: parseInt(data.stock),
      requires_prescription: data.requires_prescription === 'true',
      image_url: fileName ? `/uploads/medicamentos/${fileName}` : null
    }
  });
};

exports.updateMedicamento = async (userId, medicamentoId, data, fileName) => {
  const farmaciaId = await getFarmaciaId(userId);
  
  // Verify ownership
  const med = await prisma.medicamento.findUnique({ where: { id: parseInt(medicamentoId) } });
  if (!med || med.farmacia_id !== farmaciaId) throw Object.assign(new Error('Medicamento não encontrado ou não tem permissão'), { status: 403 });

  const updateData = { ...data };
  if (data.preco) updateData.preco = Number(data.preco);
  if (data.stock) updateData.stock = parseInt(data.stock);
  if (data.requires_prescription !== undefined) updateData.requires_prescription = String(data.requires_prescription) === 'true';
  if (fileName) updateData.image_url = `/uploads/medicamentos/${fileName}`;

  return await prisma.medicamento.update({
    where: { id: med.id },
    data: updateData
  });
};

exports.deleteMedicamento = async (userId, medicamentoId) => {
  const farmaciaId = await getFarmaciaId(userId);
  const med = await prisma.medicamento.findUnique({ where: { id: parseInt(medicamentoId) } });
  if (!med || med.farmacia_id !== farmaciaId) throw Object.assign(new Error('Permissão negada'), { status: 403 });

  // Soft delete para manter o registo no histórico de pedidos onde ele existiu
  return await prisma.medicamento.update({
    where: { id: med.id },
    data: { ativo: false }
  });
};

exports.getPedidosPendentes = async (userId) => {
  const farmaciaId = await getFarmaciaId(userId);
  // Buscar pedidos que tenham pelo menos um item desta farmacia, ou pode ser simplificado se 1 Pedido = 1 Farmácia
  // O schema permite que um pedido tenha itens de dezenas de farmácias, mas no Painel da Farmácia só devem ver os itens respeitantes a si ou o "Sub-Pedido"
  // Contudo, assumiremos a vista do pedido global contendo os itens desta farmácia:
  return await prisma.pedido.findMany({
    where: {
      PedidoItems: { some: { farmacia_id: farmaciaId } },
      status: { in: ['PENDENTE', 'CONFIRMADO', 'EM_PREPARACAO'] }
    },
    include: { PedidoItems: true, Cliente: { select: { nome: true, telefone: true } } }
  });
};

exports.getPedidoDetalhes = async (userId, pedidoId) => {
  const farmaciaId = await getFarmaciaId(userId);
  const pedido = await prisma.pedido.findFirst({
    where: { id: parseInt(pedidoId), PedidoItems: { some: { farmacia_id: farmaciaId } } },
    include: { PedidoItems: true, Historico: true, Receitas: true, Entrega: true, Cliente: true, Endereco: true }
  });
  if (!pedido) throw Object.assign(new Error('Pedido não encontrado'), { status: 404 });
  return pedido;
};

exports.updatePedidoStatus = async (userId, pedidoId, status, observacao) => {
  await getFarmaciaId(userId);
  const pedido = await prisma.pedido.update({
    where: { id: parseInt(pedidoId) },
    data: { status }
  });

  // Log no historico
  await prisma.historicoPedido.create({
    data: { pedido_id: pedido.id, status_novo: status, observacao: observacao || `Modificado pela Farmacia`, atualizado_por: userId }
  });
  return pedido;
};

exports.verificarReceita = async (userId, receitaId, valid) => {
  const farmaciaId = await getFarmaciaId(userId);
  const receita = await prisma.receita.findFirst({ where: { id: parseInt(receitaId), pedido_id: { not: null } } });
  if (!receita) throw Object.assign(new Error('Receita não encontrada'), { status: 404 });

  return await prisma.receita.update({
    where: { id: receita.id },
    data: { estado: valid ? 'APROVADA' : 'REJEITADA', farmacia_id: farmaciaId }
  });
};

exports.getEntregadores = async () => {
  return await prisma.user.findMany({
    where: { tipo: 'ENTREGADOR', status: 'ATIVO' }, // Idealmente deve haver um campo "online"
    select: { id: true, nome: true, veiculo: true, placa_veiculo: true, telefone: true }
  });
};

exports.atribuirEntregador = async (userId, pedidoId, entregadorId) => {
  // O processo cria uma atribuição de Entrega
  const pedido = await prisma.pedido.findUnique({ where: { id: parseInt(pedidoId) } });
  
  if (pedido.status !== 'PRONTO') {
    throw Object.assign(new Error('O pedido deve estar PRONTO antes de ser atribuído a um entregador'), { status: 400 });
  }

  return await prisma.entrega.upsert({
    where: { pedido_id: pedido.id },
    update: { entregador_id: parseInt(entregadorId), status: 'DISPONIVEL' },
    create: { pedido_id: pedido.id, entregador_id: parseInt(entregadorId), status: 'DISPONIVEL' }
  });
};

exports.getHistoricoPedidos = async (userId) => {
  const farmaciaId = await getFarmaciaId(userId);
  return await prisma.pedido.findMany({
    where: { PedidoItems: { some: { farmacia_id: farmaciaId } }, status: { in: ['ENTREGUE', 'CANCELADO'] } },
    include: { PedidoItems: true }
  });
};
