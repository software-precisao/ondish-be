const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");
const Usuario = require("./tb_usuarios");
const Promocao = require("./tb_promocao");

const UsuarioPromocao = conn.define(
  "tb_usuario_promocao",
  {
    id_usuario_promocao: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      references: {
        model: Usuario,
        key: "id_user",
      },
      allowNull: false,
    },
    id_promocao: {
      type: DataTypes.INTEGER,
      references: {
        model: Promocao,
        key: "id_promocao",
      },
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = UsuarioPromocao;
