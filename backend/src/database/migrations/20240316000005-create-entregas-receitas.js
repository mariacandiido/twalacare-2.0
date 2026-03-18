/**
 * Migration: tabelas entregas e receitas
 */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('entregas', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      pedido_id: { type: Sequelize.INTEGER, allowNull: false },
      entregador_id: { type: Sequelize.INTEGER, allowNull: true },
      status: {
        type: Sequelize.ENUM('disponivel', 'aceito', 'coletando', 'em_transito', 'entregue', 'cancelado'),
        defaultValue: 'disponivel',
      },
      valor_entrega: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      distancia_km: { type: Sequelize.DECIMAL(8, 2), allowNull: true },
      tempo_estimado_min: { type: Sequelize.INTEGER, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint('entregas', {
      fields: ['pedido_id'],
      type: 'foreign key',
      name: 'entregas_pedido_id_fk',
      references: { table: 'pedidos', field: 'id' },
    });
    await queryInterface.addConstraint('entregas', {
      fields: ['entregador_id'],
      type: 'foreign key',
      name: 'entregas_entregador_id_fk',
      references: { table: 'users', field: 'id' },
    });
    await queryInterface.addIndex('entregas', ['status', 'entregador_id']);

    await queryInterface.createTable('receitas', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      cliente_id: { type: Sequelize.INTEGER, allowNull: false },
      pedido_id: { type: Sequelize.INTEGER, allowNull: true },
      farmacia_id: { type: Sequelize.INTEGER, allowNull: true },
      ficheiro_url: { type: Sequelize.STRING(500), allowNull: true },
      nome_ficheiro: { type: Sequelize.STRING(255), allowNull: true },
      estado: {
        type: Sequelize.ENUM('pendente', 'aprovada', 'rejeitada'),
        defaultValue: 'pendente',
      },
      observacoes: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint('receitas', {
      fields: ['cliente_id'],
      type: 'foreign key',
      name: 'receitas_cliente_id_fk',
      references: { table: 'users', field: 'id' },
    });
    await queryInterface.addConstraint('receitas', {
      fields: ['pedido_id'],
      type: 'foreign key',
      name: 'receitas_pedido_id_fk',
      references: { table: 'pedidos', field: 'id' },
    });
    await queryInterface.addConstraint('receitas', {
      fields: ['farmacia_id'],
      type: 'foreign key',
      name: 'receitas_farmacia_id_fk',
      references: { table: 'farmacias', field: 'id' },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('receitas');
    await queryInterface.dropTable('entregas');
  },
};
