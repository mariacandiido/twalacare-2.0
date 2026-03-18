/**
 * Migration: tabela farmacias
 */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('farmacias', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      nome: { type: Sequelize.STRING(150), allowNull: false },
      nif: { type: Sequelize.STRING(30), allowNull: true },
      licenca_funcionamento: { type: Sequelize.STRING(80), allowNull: true },
      provincia: { type: Sequelize.STRING(80), allowNull: true },
      municipio: { type: Sequelize.STRING(80), allowNull: true },
      bairro: { type: Sequelize.STRING(80), allowNull: true },
      rua: { type: Sequelize.STRING(120), allowNull: true },
      num_edificio: { type: Sequelize.STRING(20), allowNull: true },
      horario_abertura: { type: Sequelize.STRING(10), allowNull: true },
      horario_fechamento: { type: Sequelize.STRING(10), allowNull: true },
      farmaceutico_nome: { type: Sequelize.STRING(120), allowNull: true },
      farmaceutico_cedula: { type: Sequelize.STRING(40), allowNull: true },
      farmaceutico_tel: { type: Sequelize.STRING(30), allowNull: true },
      avaliacao: { type: Sequelize.DECIMAL(3, 2), defaultValue: 0 },
      aprovada: { type: Sequelize.BOOLEAN, defaultValue: false },
      data_aprovacao: { type: Sequelize.DATEONLY, allowNull: true },
      rejeitada: { type: Sequelize.BOOLEAN, defaultValue: false },
      motivo_rejeicao: { type: Sequelize.TEXT, allowNull: true },
      image_url: { type: Sequelize.STRING(500), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint('farmacias', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'farmacias_user_id_fk',
      references: { table: 'users', field: 'id' },
    });
    await queryInterface.addIndex('farmacias', ['aprovada', 'rejeitada']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('farmacias');
  },
};
