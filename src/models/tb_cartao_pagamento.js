const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");


const CartaoPagamento = conn.define(
  "tb_cartao_pagamento",
  {
    id_metodo_pagamento: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numero_cartao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data_validade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cvc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    selected: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = CartaoPagamento;
