/**
 * Instância Sequelize e carregamento dos modelos.
 * As associações entre modelos são definidas nos próprios modelos.
 */
const { Sequelize } = require("sequelize");
const config = require("../config/database");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: dbConfig.define,
  },
);

const db = {
  sequelize,
  Sequelize,
  User: require("../models/User")(sequelize),
  Farmacia: require("../models/Farmacia")(sequelize),
  Medicamento: require("../models/Medicamento")(sequelize),
  Pedido: require("../models/Pedido")(sequelize),
  PedidoItem: require("../models/PedidoItem")(sequelize),
  Entrega: require("../models/Entrega")(sequelize),
  Receita: require("../models/Receita")(sequelize),
  RefreshToken: require("../models/RefreshToken")(sequelize),
};

/* Associações entre modelos */
const {
  User,
  Farmacia,
  Medicamento,
  Pedido,
  PedidoItem,
  Entrega,
  Receita,
  RefreshToken,
} = db;

/* User 1:1 Farmacia (quando tipo = farmacia) */
User.hasOne(Farmacia, { foreignKey: "user_id" });
Farmacia.belongsTo(User, { foreignKey: "user_id" });

/* Farmacia 1:N Medicamento */
Farmacia.hasMany(Medicamento, { foreignKey: "farmacia_id" });
Medicamento.belongsTo(Farmacia, { foreignKey: "farmacia_id" });

/* User (cliente) 1:N Pedido */
User.hasMany(Pedido, { foreignKey: "cliente_id" });
Pedido.belongsTo(User, { foreignKey: "cliente_id" });

/* Pedido N:M Farmacia via pedido_itens (cada item tem farmacia_id) */
Pedido.hasMany(PedidoItem, { foreignKey: "pedido_id" });
PedidoItem.belongsTo(Pedido, { foreignKey: "pedido_id" });
Medicamento.hasMany(PedidoItem, { foreignKey: "medicamento_id" });
PedidoItem.belongsTo(Medicamento, { foreignKey: "medicamento_id" });
Farmacia.hasMany(PedidoItem, { foreignKey: "farmacia_id" });
PedidoItem.belongsTo(Farmacia, { foreignKey: "farmacia_id" });

/* Entrega: Pedido 1:1 Entrega, User (entregador) N:1 Entrega */
Pedido.hasOne(Entrega, { foreignKey: "pedido_id" });
Entrega.belongsTo(Pedido, { foreignKey: "pedido_id" });
User.hasMany(Entrega, { foreignKey: "entregador_id" });
Entrega.belongsTo(User, { foreignKey: "entregador_id" });

/* Receita: User (cliente) envia; pode estar ligada a Pedido */
User.hasMany(Receita, { foreignKey: "cliente_id" });
Receita.belongsTo(User, { foreignKey: "cliente_id" });
Pedido.hasMany(Receita, { foreignKey: "pedido_id" });
Receita.belongsTo(Pedido, { foreignKey: "pedido_id" });
Farmacia.hasMany(Receita, { foreignKey: "farmacia_id" });
Receita.belongsTo(Farmacia, { foreignKey: "farmacia_id" });

User.hasMany(RefreshToken, { foreignKey: "user_id" });
RefreshToken.belongsTo(User, { foreignKey: "user_id" });

module.exports = db;
