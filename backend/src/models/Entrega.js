/**
 * Modelo Entrega: entrega de um pedido por um entregador.
 */
const { DataTypes } = require('sequelize');

const DELIVERY_STATUS = ['disponivel', 'aceito', 'coletando', 'em_transito', 'entregue', 'cancelado'];

module.exports = (sequelize) => {
  const Entrega = sequelize.define(
    'Entrega',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'pedidos', key: 'id' },
      },
      entregador_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
      },
      status: {
        type: DataTypes.ENUM(...DELIVERY_STATUS),
        defaultValue: 'disponivel',
      },
      valor_entrega: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      distancia_km: { type: DataTypes.DECIMAL(8, 2), allowNull: true },
      tempo_estimado_min: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: 'entregas',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Entrega;
};
