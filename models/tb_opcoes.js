const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Prato = require("./tb_pratos");

const Opcoes = conn.define(
  "tb_opcoes",
  {
    id_opcoes: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valorAdicional: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    obrigatorio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_pratos: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

Opcoes.belongsTo(Prato, {
  foreignKey: "id_pratos",
  as: "prato",
});

module.exports = Opcoes;
