/**
 * Migration: tabelas pedidos e pedido_itens
 */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pedidos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      cliente_id: { type: Sequelize.INTEGER, allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      taxa_entrega: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      total: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      status: {
        type: Sequelize.ENUM('pendente', 'confirmado', 'em_preparacao', 'pronto', 'em_transito', 'entregue', 'cancelado'),
        defaultValue: 'pendente',
      },
      metodo_pagamento: { type: Sequelize.STRING(80), allowNull: true },
      endereco_entrega: { type: Sequelize.STRING(255), allowNull: true },
      data_entrega_estimada: { type: Sequelize.DATEONLY, allowNull: true },
      data_entrega: { type: Sequelize.DATEONLY, allowNull: true },
      data_pedido: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint('pedidos', {
      fields: ['cliente_id'],
      type: 'foreign key',
      name: 'pedidos_cliente_id_fk',
      references: { table: 'users', field: 'id' },
    });
    await queryInterface.addIndex('pedidos', ['cliente_id', 'status']);

    await queryInterface.createTable('pedido_itens', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      pedido_id: { type: Sequelize.INTEGER, allowNull: false },
      medicamento_id: { type: Sequelize.INTEGER, allowNull: false },
      farmacia_id: { type: Sequelize.INTEGER, allowNull: false },
      nome: { type: Sequelize.STRING(150), allowNull: false },
      preco_unitario: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      quantidade: { type: Sequelize.INTEGER, allowNull: false },
      requires_prescription: { type: Sequelize.BOOLEAN, defaultValue: false },
    });
    await queryInterface.addConstraint('pedido_itens', {
      fields: ['pedido_id'],
      type: 'foreign key',
      name: 'pedido_itens_pedido_id_fk',
      references: { table: 'pedidos', field: 'id' },
    });
    await queryInterface.addConstraint('pedido_itens', {
      fields: ['medicamento_id'],
      type: 'foreign key',
      name: 'pedido_itens_medicamento_id_fk',
      references: { table: 'medicamentos', field: 'id' },
    });
    await queryInterface.addConstraint('pedido_itens', {
      fields: ['farmacia_id'],
      type: 'foreign key',
      name: 'pedido_itens_farmacia_id_fk',
      references: { table: 'farmacias', field: 'id' },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('pedido_itens');
    await queryInterface.dropTable('pedidos');
  },
};
