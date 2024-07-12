const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Restaurante = require("./tb_restaurante");

const Mesa = conn.define(
  "tb_mesa",
  {
    id_mesa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    localizacao: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_restaurante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

Mesa.belongsTo(Restaurante, {
  foreignKey: "id_restaurante",
  as: "restaurante",
});

module.exports = Mesa;
