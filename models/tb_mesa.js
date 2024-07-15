const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Restaurante = require("./tb_restaurante");
const StatusMesa = require("./tb_status_mesa");

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
      type: DataTypes.STRING,  // Alterado para STRING se for um texto, ajuste conforme necessário
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

Mesa.hasMany(StatusMesa, {
  foreignKey: "id_mesa",
  as: "status_mesa",
});

module.exports = Mesa;