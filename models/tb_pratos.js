const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Restaurante = require("./tb_restaurante");
const CozinhaRestaurante = require("./tb_cozinha_restaurante");


const Pratos = conn.define(
  "tb_pratos",
  {
    id_pratos: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo_prato: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tempo_preparo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    taxa_ondish: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    id_cozinha_restaurante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_restaurante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prato_do_dia: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);

Pratos.belongsTo(Restaurante, {
  foreignKey: "id_restaurante",
  as: "restaurante",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Pratos.belongsTo(CozinhaRestaurante, {
  foreignKey: "id_cozinha_restaurante",
  as: "cozinha_restaurante",
  foreignKeyConstraint: true,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Pratos;
