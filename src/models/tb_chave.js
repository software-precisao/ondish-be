const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");

const Chave = conn.define(
  "tb_chave",
  {
    id_chave: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    prod: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);

module.exports = Chave;
