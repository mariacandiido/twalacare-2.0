/**
 * Migration: tabela refresh_tokens para refresh JWT
 */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('refresh_tokens', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      token: { type: Sequelize.STRING(500), allowNull: false },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      revoked: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint('refresh_tokens', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'refresh_tokens_user_id_fk',
      references: { table: 'users', field: 'id' },
    });
    await queryInterface.addIndex('refresh_tokens', ['token']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('refresh_tokens');
  },
};
