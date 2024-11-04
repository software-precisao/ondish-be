const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");


const Veiculo = conn.define(
  "tb_veiculo",
  {
    id_veiculo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false, 
      primaryKey: true,
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  },
  { freezeTableName: true }
);

module.exports = Veiculo;