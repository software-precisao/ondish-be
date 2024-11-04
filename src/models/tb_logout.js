const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");

const Logado = conn.define(
  "tb_logout",
  {
    id_logado: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  },
  { freezeTableName: true }
);

module.exports = Logado;