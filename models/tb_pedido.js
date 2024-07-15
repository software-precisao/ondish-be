const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Usuario = require("./tb_usuarios");
const Restaurante = require("./tb_restaurante");
const Sala = require("./tb_sala");
const Mesa = require("./tb_mesa");

const Pedido = conn.define(
  "tb_pedidos",
  {
    id_pedido: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_restaurante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_sala: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_mesa: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    numero_pedido: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);

Pedido.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

Pedido.belongsTo(Restaurante, {
  foreignKey: "id_restaurante",
  as: "restaurante",
});

Pedido.belongsTo(Sala, {
  foreignKey: "id_sala",
  as: "sala",
});

Pedido.belongsTo(Mesa, {
  foreignKey: "id_mesa",
  as: "mesa",
});


module.exports = Pedido;