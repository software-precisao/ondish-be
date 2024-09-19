const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Restaurante = require("./tb_restaurante");
const Usuario = require("./tb_usuarios");

const Avaliacao = conn.define(
  "tb_avaliacao",
  {
    id_avaliacao: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    avaliacao: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_restaurante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

Avaliacao.belongsTo(Restaurante, {
  foreignKey: "id_restaurante",
  as: "restaurante",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Avaliacao.belongsTo(Usuario, {
  foreignKey: "id_user",
  foreignKeyConstraint: true,
});

module.exports = Avaliacao;
