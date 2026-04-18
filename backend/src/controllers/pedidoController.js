/**
 * Controller de pedidos: criar, listar por cliente/farmácia, atualizar status.
 */
const { prisma } = require('../lib/prisma');
const pedidoRepository = require('../repositories/pedidoRepository');
const asyncHandler = require('../utils/asyncHandler');

const create = asyncHandler(async (req, res) => {
  const {
    items,
    subtotal,
    taxa_entrega,
    total,
    metodo_pagamento,
    endereco_entrega,
  } = req.body;
  const pedido = await pedidoRepository.create(
    {
      cliente_id: req.userId,
      subtotal,
      taxa_entrega: taxa_entrega || 0,
      total,
      metodo_pagamento,
      endereco_entrega,
      status: 'PENDENTE',
    },
    items,
  );
  res.status(201).json({ status: 'success', data: { pedido } });
});

const getMy = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const { rows, count } = await pedidoRepository.findByCliente(
    req.userId,
    limit,
    offset,
  );
  res.json({
    status: 'success',
    data: {
      pedidos: rows,
      total: count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    },
  });
});

const getById = asyncHandler(async (req, res) => {
  const pedido = await pedidoRepository.findById(req.params.id);
  if (!pedido)
    return res
      .status(404)
      .json({ status: 'error', message: 'Pedido não encontrado' });

  if (pedido.cliente_id === req.userId || req.user.tipo === 'admin') {
    return res.json({ status: 'success', data: { pedido } });
  }

  if (req.user.tipo === 'farmacia') {
    const farmacia = await prisma.farmacia.findUnique({
      where: { user_id: req.userId },
    });
    const possuiItem = pedido.PedidoItems?.some(
      (item) => item.farmacia_id === farmacia?.id,
    );
    if (possuiItem) {
      return res.json({ status: 'success', data: { pedido } });
    }
  }

  return res.status(403).json({ status: 'error', message: 'Sem permissão' });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const pedido = await pedidoRepository.findById(req.params.id);
  if (!pedido)
    return res
      .status(404)
      .json({ status: 'error', message: 'Pedido não encontrado' });

  const allowedClient = ['CANCELADO'];
  const allowedFarmacia = ['CONFIRMADO', 'EM_TRANSITO'];
  const allowedAdmin = [
    'PENDENTE',
    'CONFIRMADO',
    'EM_TRANSITO',
    'ENTREGUE',
    'CANCELADO',
  ];

  const upperStatus = status.toUpperCase();

  if (req.user.tipo === 'cliente' && !allowedClient.includes(upperStatus)) {
    return res
      .status(403)
      .json({
        status: 'error',
        message: 'Cliente não pode atualizar para este status',
      });
  }

  if (req.user.tipo === 'farmacia') {
    const farmacia = await prisma.farmacia.findUnique({
      where: { user_id: req.userId },
    });
    const possuiItem = pedido.PedidoItems?.some(
      (item) => item.farmacia_id === farmacia?.id,
    );
    if (!farmacia || !possuiItem) {
      return res
        .status(403)
        .json({
          status: 'error',
          message: 'Farmácia não vinculada a este pedido',
        });
    }
    if (!allowedFarmacia.includes(upperStatus)) {
      return res
        .status(403)
        .json({
          status: 'error',
          message: 'Farmácia não pode atualizar para este status',
        });
    }
  }

  if (req.user.tipo === 'admin' && !allowedAdmin.includes(upperStatus)) {
    return res
      .status(403)
      .json({ status: 'error', message: 'Status inválido para admin' });
  }

  const atualizado = await pedidoRepository.updateStatus(req.params.id, upperStatus);
  res.json({ status: 'success', data: { pedido: atualizado } });
});

const listByFarmacia = asyncHandler(async (req, res) => {
  const farmacia = await prisma.farmacia.findUnique({
    where: { user_id: req.userId },
  });
  if (!farmacia)
    return res
      .status(404)
      .json({ status: 'error', message: 'Farmácia não encontrada' });
  const { page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const { rows, count } = await pedidoRepository.findByFarmacia(
    farmacia.id,
    limit,
    offset,
  );
  res.json({
    status: 'success',
    data: {
      pedidos: rows,
      total: count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    },
  });
});

module.exports = { create, getMy, getById, updateStatus, listByFarmacia };
