/**
 * Modelo RefreshToken: tokens de refresh JWT para renovar o access token.
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RefreshToken = sequelize.define(
    'RefreshToken',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      token: { type: DataTypes.STRING(500), allowNull: false },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: 'refresh_tokens',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );
  return RefreshToken;
};
