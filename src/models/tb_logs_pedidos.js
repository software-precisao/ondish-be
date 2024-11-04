const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");

const Pedido = require("../models/tb_pedido");
const LogPedido = conn.define(
  "tb_logs_pedidos",
  {
    id_log: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Pedido,
        key: "id_pedido",
      },
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = LogPedido;
