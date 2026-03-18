/**
 * Modelo Receita: receita médica enviada pelo cliente (upload ou link).
 * Pode estar associada a um pedido e a uma farmácia.
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Receita = sequelize.define(
    'Receita',
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
      pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'pedidos', key: 'id' },
      },
      farmacia_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'farmacias', key: 'id' },
      },
      ficheiro_url: { type: DataTypes.STRING(500), allowNull: true },
      nome_ficheiro: { type: DataTypes.STRING(255), allowNull: true },
      estado: {
        type: DataTypes.ENUM('pendente', 'aprovada', 'rejeitada'),
        defaultValue: 'pendente',
      },
      observacoes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName: 'receitas',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Receita;
};
