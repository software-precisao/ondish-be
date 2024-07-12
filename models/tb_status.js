const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Status = conn.define(
  "tb_status",
  {
    id_status: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  { freezeTableName: true }
);

module.exports = Status;