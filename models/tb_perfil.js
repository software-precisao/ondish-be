const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Usuario = require("./tb_usuarios");

const Perfil = conn.define(
  "tb_perfil",
  {
    id_perfil: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    morada: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    codigo_postal: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

Perfil.belongsTo(Usuario, {
  foreignKey: "id_user",
  foreignKeyConstraint: true,
});

module.exports = Perfil;
