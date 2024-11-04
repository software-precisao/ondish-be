const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");

const Nivel = conn.define(
  "tb_nivel",
  {
    id_nivel: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false, 
      primaryKey: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

module.exports = Nivel;
