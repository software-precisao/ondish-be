const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");


const AppInfo = conn.define(
  "tb_info",
  {
    id_info: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    versao_atual: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link_termos_condicoes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link_politica_privacidade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link_play_store: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link_app_store: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = AppInfo;
