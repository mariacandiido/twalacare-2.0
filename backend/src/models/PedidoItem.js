/**
 * Modelo PedidoItem: linha do pedido (medicamento + quantidade + preço + farmácia).
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PedidoItem = sequelize.define(
    'PedidoItem',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'pedidos', key: 'id' },
      },
      medicamento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'medicamentos', key: 'id' },
      },
      farmacia_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'farmacias', key: 'id' },
      },
      nome: { type: DataTypes.STRING(150), allowNull: false },
      preco_unitario: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      quantidade: { type: DataTypes.INTEGER, allowNull: false },
      requires_prescription: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: 'pedido_itens',
      underscored: true,
      timestamps: false,
    }
  );

  return PedidoItem;
};
