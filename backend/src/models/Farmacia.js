/**
 * Modelo Farmacia: dados da farmácia (ligada a User quando tipo=farmacia).
 * Inclui NIF, endereço, horários e estado de aprovação pelo admin.
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Farmacia = sequelize.define(
    'Farmacia',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
      },
      nome: { type: DataTypes.STRING(150), allowNull: false },
      nif: { type: DataTypes.STRING(30), allowNull: true },
      licenca_funcionamento: { type: DataTypes.STRING(80), allowNull: true },
      provincia: { type: DataTypes.STRING(80), allowNull: true },
      municipio: { type: DataTypes.STRING(80), allowNull: true },
      bairro: { type: DataTypes.STRING(80), allowNull: true },
      rua: { type: DataTypes.STRING(120), allowNull: true },
      num_edificio: { type: DataTypes.STRING(20), allowNull: true },
      horario_abertura: { type: DataTypes.STRING(10), allowNull: true },
      horario_fechamento: { type: DataTypes.STRING(10), allowNull: true },
      farmaceutico_nome: { type: DataTypes.STRING(120), allowNull: true },
      farmaceutico_cedula: { type: DataTypes.STRING(40), allowNull: true },
      farmaceutico_tel: { type: DataTypes.STRING(30), allowNull: true },
      avaliacao: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
      aprovada: { type: DataTypes.BOOLEAN, defaultValue: false },
      data_aprovacao: { type: DataTypes.DATEONLY, allowNull: true },
      rejeitada: { type: DataTypes.BOOLEAN, defaultValue: false },
      motivo_rejeicao: { type: DataTypes.TEXT, allowNull: true },
      image_url: { type: DataTypes.STRING(500), allowNull: true },
    },
    {
      tableName: 'farmacias',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Farmacia;
};
