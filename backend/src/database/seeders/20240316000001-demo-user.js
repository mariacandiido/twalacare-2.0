/**
 * Seeder: utilizador admin e cliente de demonstração.
 * As senhas são hash bcrypt de "123456" e "admin123".
 */
'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashUser = await bcrypt.hash('123456', 12);
    const hashAdmin = await bcrypt.hash('admin123', 12);
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        nome: 'Admin TwalaCare',
        email: 'admin@twalcare.com',
        password_hash: hashAdmin,
        telefone: '+244 900 000 000',
        tipo: 'admin',
        status: 'ativo',
        created_at: now,
        updated_at: now,
      },
      {
        nome: 'Maria Cliente',
        email: 'cliente@gmail.com',
        password_hash: hashUser,
        telefone: '+244 900 000 001',
        tipo: 'cliente',
        status: 'ativo',
        provincia: 'Luanda',
        municipio: 'Ingombota',
        endereco: 'Rua da Missão, 45',
        data_nascimento: '1995-03-20',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: ['admin@twalcare.com', 'cliente@gmail.com'] });
  },
};
