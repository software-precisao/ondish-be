const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");

const Mesa = require("./tb_mesa");

const StatusMesa = conn.define(
  "tb_status_mesa",
  {
    id_status_mesa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

module.exports = StatusMesa;
