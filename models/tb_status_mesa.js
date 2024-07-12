const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Mesa = require("./tb_mesa");

const StatusMesa = conn.define(
  "tb_status_mesa",
  {
    id_status_mesa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_mesa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

StatusMesa.belongsTo(Mesa, {
  foreignKey: "id_mesa",
  as: "mesa",
});


module.exports = StatusMesa;
