/**
 * Modelo Pedido: compra do cliente com itens e status.
 */
const { DataTypes } = require('sequelize');

const ORDER_STATUS = [
  'pendente', 'confirmado', 'em_preparacao', 'pronto',
  'em_transito', 'entregue', 'cancelado',
];

module.exports = (sequelize) => {
  const Pedido = sequelize.define(
    'Pedido',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      taxa_entrega: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      status: {
        type: DataTypes.ENUM(...ORDER_STATUS),
        defaultValue: 'pendente',
      },
      metodo_pagamento: { type: DataTypes.STRING(80), allowNull: true },
      endereco_entrega: { type: DataTypes.STRING(255), allowNull: true },
      data_entrega_estimada: { type: DataTypes.DATEONLY, allowNull: true },
      data_entrega: { type: DataTypes.DATEONLY, allowNull: true },
    },
    {
      tableName: 'pedidos',
      underscored: true,
      timestamps: true,
      createdAt: 'data_pedido',
      updatedAt: 'updated_at',
    }
  );

  return Pedido;
};
