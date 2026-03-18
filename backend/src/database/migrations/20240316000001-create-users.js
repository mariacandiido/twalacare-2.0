/**
 * Migration: tabela users
 */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nome: { type: Sequelize.STRING(150), allowNull: false },
      email: { type: Sequelize.STRING(180), allowNull: false },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      telefone: { type: Sequelize.STRING(30), allowNull: true },
      tipo: {
        type: Sequelize.ENUM('cliente', 'farmacia', 'entregador', 'admin'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('ativo', 'inativo', 'suspenso', 'pendente_aprovacao'),
        defaultValue: 'ativo',
      },
      data_nascimento: { type: Sequelize.DATEONLY, allowNull: true },
      provincia: { type: Sequelize.STRING(80), allowNull: true },
      municipio: { type: Sequelize.STRING(80), allowNull: true },
      endereco: { type: Sequelize.STRING(255), allowNull: true },
      veiculo: { type: Sequelize.STRING(50), allowNull: true },
      placa_veiculo: { type: Sequelize.STRING(20), allowNull: true },
      cargo: { type: Sequelize.STRING(80), allowNull: true },
      departamento: { type: Sequelize.STRING(80), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('users', ['email'], { unique: true });
    await queryInterface.addIndex('users', ['tipo', 'status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
