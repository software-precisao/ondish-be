const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Pedido = require("./tb_pedido");
const Usuario = require("./tb_usuarios");

const PedidoParticipante = conn.define(
  "tb_pedido_participante",
  {
    id_pedido_participante: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

PedidoParticipante.belongsTo(Pedido, {
  foreignKey: "id_pedido",
  as: "pedido",
});

PedidoParticipante.belongsTo(Usuario, {
  foreignKey: "id_user",
  as: "usuario",
});

module.exports = PedidoParticipante;
