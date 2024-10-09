const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const BoasVindas = conn.define(
  "tb_boas_vindas",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);



module.exports = BoasVindas;
