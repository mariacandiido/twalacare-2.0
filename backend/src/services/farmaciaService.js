const { prisma } = require("../lib/prisma");

// ================= HELPERS =================

const toInt = (value) => {
  const num = Number(value);
  if (isNaN(num)) {
    const err = new Error("ID inválido");
    err.status = 400;
    throw err;
  }
  return num;
};

// Auxiliar: Extrair id_farmacia
async function getFarmaciaId(userId) {
  const farmacia = await prisma.farmacia.findUnique({
    where: { user_id: userId },
  });

  if (!farmacia) {
    const err = new Error("Conta de Farmácia não configurada");
    err.status = 404;
    throw err;
  }

  return farmacia.id;
}

// ================= PERFIL =================

exports.updatePerfil = async (userId, data) => {
  const farmaciaId = await getFarmaciaId(userId);

  return prisma.farmacia.update({
    where: { id: farmaciaId },
    data,
  });
};

// ================= MEDICAMENTOS =================

exports.getMedicamentos = async (userId) => {
  const farmaciaId = await getFarmaciaId(userId);

  return prisma.medicamento.findMany({
    where: { farmacia_id: farmaciaId, ativo: true },
    include: { Categoria: true },
  });
};

exports.createMedicamento = async (userId, data, fileName) => {
  const farmaciaId = await getFarmaciaId(userId);

  return prisma.medicamento.create({
    data: {
      ...data,
      farmacia_id: farmaciaId,
      preco: Number(data.preco),
      stock: Number(data.stock),
      requires_prescription: String(data.requires_prescription) === "true",
      image_url: fileName
        ? `/uploads/medicamentos/${fileName}`
        : null,
    },
  });
};

exports.updateMedicamento = async (
  userId,
  medicamentoId,
  data,
  fileName
) => {
  const farmaciaId = await getFarmaciaId(userId);
  const id = toInt(medicamentoId);

  const med = await prisma.medicamento.findUnique({
    where: { id },
  });

  if (!med || med.farmacia_id !== farmaciaId) {
    const err = new Error("Sem permissão para este medicamento");
    err.status = 403;
    throw err;
  }

  const updateData = { ...data };

  if (data.preco !== undefined)
    updateData.preco = Number(data.preco);

  if (data.stock !== undefined)
    updateData.stock = Number(data.stock);

  if (data.requires_prescription !== undefined)
    updateData.requires_prescription =
      String(data.requires_prescription) === "true";

  if (fileName)
    updateData.image_url = `/uploads/medicamentos/${fileName}`;

  return prisma.medicamento.update({
    where: { id },
    data: updateData,
  });
};

exports.deleteMedicamento = async (userId, medicamentoId) => {
  const farmaciaId = await getFarmaciaId(userId);
  const id = toInt(medicamentoId);

  const med = await prisma.medicamento.findUnique({
    where: { id },
  });

  if (!med || med.farmacia_id !== farmaciaId) {
    const err = new Error("Permissão negada");
    err.status = 403;
    throw err;
  }

  return prisma.medicamento.update({
    where: { id },
    data: { ativo: false },
  });
};

// ================= PEDIDOS =================

exports.getPedidosPendentes = async (userId) => {
  const farmaciaId = await getFarmaciaId(userId);

  return prisma.pedido.findMany({
    where: {
      PedidoItems: { some: { farmacia_id: farmaciaId } },
      status: {
        in: ["PENDENTE", "CONFIRMADO", "EM_PREPARACAO"],
      },
    },
    include: {
      PedidoItems: true,
      Cliente: { select: { nome: true, telefone: true } },
    },
  });
};

exports.getPedidoDetalhes = async (userId, pedidoId) => {
  const farmaciaId = await getFarmaciaId(userId);
  const id = toInt(pedidoId);

  const pedido = await prisma.pedido.findFirst({
    where: {
      id,
      PedidoItems: { some: { farmacia_id: farmaciaId } },
    },
    include: {
      PedidoItems: true,
      Historico: true,
      Receitas: true,
      Entrega: true,
      Cliente: true,
      Endereco: true,
    },
  });

  if (!pedido) {
    const err = new Error("Pedido não encontrado");
    err.status = 404;
    throw err;
  }

  return pedido;
};

exports.updatePedidoStatus = async (
  userId,
  pedidoId,
  status,
  observacao
) => {
  const farmaciaId = await getFarmaciaId(userId);
  const id = toInt(pedidoId);

  const pedido = await prisma.pedido.findFirst({
    where: {
      id,
      PedidoItems: { some: { farmacia_id: farmaciaId } },
    },
  });

  if (!pedido) {
    const err = new Error("Sem permissão para este pedido");
    err.status = 403;
    throw err;
  }

  const updated = await prisma.pedido.update({
    where: { id },
    data: { status },
  });

  await prisma.historicoPedido.create({
    data: {
      pedido_id: id,
      status_novo: status,
      observacao:
        observacao || "Atualizado pela farmácia",
      atualizado_por: userId,
    },
  });

  return updated;
};

exports.verificarReceita = async (
  userId,
  receitaId,
  valid
) => {
  const farmaciaId = await getFarmaciaId(userId);
  const id = toInt(receitaId);

  const receita = await prisma.receita.findUnique({
    where: { id },
  });

  if (!receita) {
    const err = new Error("Receita não encontrada");
    err.status = 404;
    throw err;
  }

  return prisma.receita.update({
    where: { id },
    data: {
      estado: valid ? "APROVADA" : "REJEITADA",
      farmacia_id: farmaciaId,
    },
  });
};

// ================= ENTREGADORES =================

exports.getEntregadores = async () => {
  return prisma.user.findMany({
    where: {
      tipo: "ENTREGADOR",
      status: "ATIVO",
    },
    select: {
      id: true,
      nome: true,
      veiculo: true,
      placa_veiculo: true,
      telefone: true,
    },
  });
};

exports.atribuirEntregador = async (
  userId,
  pedidoId,
  entregadorId
) => {
  const id = toInt(pedidoId);
  const entregador = toInt(entregadorId);

  const pedido = await prisma.pedido.findUnique({
    where: { id },
  });

  if (!pedido) {
    const err = new Error("Pedido não encontrado");
    err.status = 404;
    throw err;
  }

  if (pedido.status !== "PRONTO") {
    const err = new Error(
      "Pedido deve estar PRONTO para atribuir entregador"
    );
    err.status = 400;
    throw err;
  }

  return prisma.entrega.upsert({
    where: { pedido_id: id },
    update: {
      entregador_id: entregador,
      status: "DISPONIVEL",
    },
    create: {
      pedido_id: id,
      entregador_id: entregador,
      status: "DISPONIVEL",
    },
  });
};

// ================= HISTÓRICO =================

exports.getHistoricoPedidos = async (userId) => {
  const farmaciaId = await getFarmaciaId(userId);

  return prisma.pedido.findMany({
    where: {
      PedidoItems: { some: { farmacia_id: farmaciaId } },
      status: { in: ["ENTREGUE", "CANCELADO"] },
    },
    include: { PedidoItems: true },
  });
};