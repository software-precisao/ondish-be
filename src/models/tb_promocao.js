const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");

const Promocao = conn.define(
  "tb_promocao",
  {
    id_promocao: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    porcentagem_desconto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valor_minimo: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Promocao;
