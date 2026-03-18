/**
 * Migration: tabela medicamentos
 */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medicamentos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      farmacia_id: { type: Sequelize.INTEGER, allowNull: false },
      nome: { type: Sequelize.STRING(150), allowNull: false },
      categoria: { type: Sequelize.STRING(80), allowNull: true },
      descricao: { type: Sequelize.TEXT, allowNull: true },
      preco: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      stock: { type: Sequelize.INTEGER, defaultValue: 0 },
      requires_prescription: { type: Sequelize.BOOLEAN, defaultValue: false },
      image_url: { type: Sequelize.STRING(500), allowNull: true },
      provincia: { type: Sequelize.STRING(80), allowNull: true },
      rating: { type: Sequelize.DECIMAL(3, 2), defaultValue: 0 },
      horario: { type: Sequelize.STRING(50), allowNull: true },
      ativo: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint('medicamentos', {
      fields: ['farmacia_id'],
      type: 'foreign key',
      name: 'medicamentos_farmacia_id_fk',
      references: { table: 'farmacias', field: 'id' },
    });
    await queryInterface.addIndex('medicamentos', ['nome', 'categoria', 'farmacia_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('medicamentos');
  },
};
