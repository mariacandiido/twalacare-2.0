const { prisma } = require('../lib/prisma');

exports.getFarmacias = async () => {
  return await prisma.farmacia.findMany({
    where: { aprovada: true, User: { status: 'ATIVO' } },
    include: { Endereco: true }
  });
};

exports.getMedicamentos = async (query) => {
  const where = { ativo: true };
  if (query) {
    where.nome = { contains: query }; // Case-insensitive search natively in modern Prisma depending on DB or using raw if needed, but contains works fine.
  }
  return await prisma.medicamento.findMany({
    where,
    include: { Categoria: true, Farmacia: { select: { nome: true, avaliacao: true } } }
  });
};

exports.getEnderecos = async (userId) => {
  return await prisma.endereco.findMany({ where: { user_id: userId } });
};

exports.createEndereco = async (userId, data) => {
  if (data.is_padrao) {
    await prisma.endereco.updateMany({ where: { user_id: userId }, data: { is_padrao: false } });
  }
  return await prisma.endereco.create({
    data: { ...data, user_id: userId }
  });
};

exports.createPedido = async (userId, payload) => {
  const { endereco_id, itens, metodo_pagamento } = payload;
  
  // Calcular totais
  let subtotal = 0;
  for (const item of itens) {
    const med = await prisma.medicamento.findUnique({ where: { id: item.medicamento_id } });
    if (!med) throw Object.assign(new Error(`Medicamento ${item.medicamento_id} não encontrado`), { status: 404 });
    if (med.stock < item.quantidade) throw Object.assign(new Error(`Stock insuficiente para ${med.nome}`), { status: 400 });
    
    subtotal += Number(med.preco) * item.quantidade;
  }
  
  const taxa_entrega = 1500.00; // Valor fixo ou calculado
  const total = subtotal + taxa_entrega;

  return await prisma.$transaction(async (tx) => {
    // 1. Criar Pedido
    const pedido = await tx.pedido.create({
      data: {
        cliente_id: userId,
        endereco_id,
        subtotal,
        taxa_entrega,
        total,
        status: 'PENDENTE'
      }
    });

    // 2. Criar Itens do Pedido & Descontar Stock
    const pedidoItens = [];
    for (const item of itens) {
      const med = await tx.medicamento.update({
        where: { id: item.medicamento_id },
        data: { stock: { decrement: item.quantidade } }
      });
      
      pedidoItens.push({
        pedido_id: pedido.id,
        medicamento_id: med.id,
        farmacia_id: med.farmacia_id,
        nome: med.nome,
        preco_unitario: med.preco,
        quantidade: item.quantidade,
        requires_prescription: med.requires_prescription
      });
    }
    
    await tx.pedidoItem.createMany({ data: pedidoItens });

    // 3. Criar Pagamento
    await tx.pagamento.create({
      data: {
        pedido_id: pedido.id,
        metodo_pagamento,
        valor: total,
        status: 'PENDENTE'
      }
    });

    // 4. Record Historico
    await tx.historicoPedido.create({
      data: { pedido_id: pedido.id, status_novo: 'PENDENTE', observacao: 'Pedido criado pelo cliente', atualizado_por: userId }
    });

    return pedido;
  });
};

exports.getHistoricoPedidos = async (userId) => {
  return await prisma.pedido.findMany({
    where: { cliente_id: userId },
    include: { PedidoItems: true, Pagamento: true, Historico: { orderBy: { createdAt: 'desc' } } },
    orderBy: { createdAt: 'desc' }
  });
};

exports.getEstatusPedido = async (userId, pedidoId) => {
  const pedido = await prisma.pedido.findFirst({
    where: { id: parseInt(pedidoId), cliente_id: userId },
    include: { Historico: { orderBy: { createdAt: 'desc' } }, Entrega: true }
  });
  if (!pedido) throw Object.assign(new Error('Pedido não encontrado'), { status: 404 });
  return pedido;
};

exports.uploadReceita = async (userId, pedidoId, filename) => {
  return await prisma.receita.create({
    data: {
      cliente_id: userId,
      pedido_id: parseInt(pedidoId),
      ficheiro_url: `/uploads/receitas/${filename}`,
      nome_ficheiro: filename,
      estado: 'PENDENTE'
    }
  });
};

exports.createAvaliacao = async (userId, payload) => {
  return await prisma.avaliacao.create({
    data: {
      cliente_id: userId,
      pedido_id: payload.pedido_id,
      farmacia_id: payload.farmacia_id,
      medicamento_id: payload.medicamento_id,
      rating: payload.rating,
      comentario: payload.comentario
    }
  });
};
