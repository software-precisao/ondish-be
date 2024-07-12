const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Cozinha = conn.define(
  "tb_cozinha",
  {
    id_cozinha: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false, 
      primaryKey: true,
    },
    nome_cozinha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

module.exports = Cozinha;