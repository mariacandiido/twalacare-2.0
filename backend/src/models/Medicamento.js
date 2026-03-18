/**
 * Modelo Medicamento: produto vendido por uma farmácia.
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Medicamento = sequelize.define(
    'Medicamento',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      farmacia_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'farmacias', key: 'id' },
      },
      nome: { type: DataTypes.STRING(150), allowNull: false },
      categoria: { type: DataTypes.STRING(80), allowNull: true },
      descricao: { type: DataTypes.TEXT, allowNull: true },
      preco: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      stock: { type: DataTypes.INTEGER, defaultValue: 0 },
      requires_prescription: { type: DataTypes.BOOLEAN, defaultValue: false },
      image_url: { type: DataTypes.STRING(500), allowNull: true },
      provincia: { type: DataTypes.STRING(80), allowNull: true },
      rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
      horario: { type: DataTypes.STRING(50), allowNull: true },
      ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      tableName: 'medicamentos',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Medicamento;
};
