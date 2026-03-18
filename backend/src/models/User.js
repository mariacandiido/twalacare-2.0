/**
 * Modelo User: utilizadores da plataforma (cliente, farmacia, entregador, admin).
 * A senha é armazenada em hash (bcrypt) no campo password_hash.
 */
const { DataTypes } = require('sequelize');

const USER_TYPES = ['cliente', 'farmacia', 'entregador', 'admin'];
const USER_STATUS = ['ativo', 'inativo', 'suspenso', 'pendente_aprovacao'];

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      telefone: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      tipo: {
        type: DataTypes.ENUM(...USER_TYPES),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...USER_STATUS),
        defaultValue: 'ativo',
      },
      /* Campos opcionais usados por cliente/entregador */
      data_nascimento: { type: DataTypes.DATEONLY, allowNull: true },
      provincia: { type: DataTypes.STRING(80), allowNull: true },
      municipio: { type: DataTypes.STRING(80), allowNull: true },
      endereco: { type: DataTypes.STRING(255), allowNull: true },
      /* Entregador */
      veiculo: { type: DataTypes.STRING(50), allowNull: true },
      placa_veiculo: { type: DataTypes.STRING(20), allowNull: true },
      /* Admin */
      cargo: { type: DataTypes.STRING(80), allowNull: true },
      departamento: { type: DataTypes.STRING(80), allowNull: true },
    },
    {
      tableName: 'users',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      defaultScope: {
        attributes: { exclude: ['password_hash'] },
      },
      scopes: {
        withPassword: { attributes: {} },
      },
    }
  );

  return User;
};
