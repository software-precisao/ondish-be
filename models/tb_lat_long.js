const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Usuario = require("./tb_usuarios");
const Restaurante = require("./tb_restaurante");

const LatLong = conn.define(
  "tb_lat_long",
  {
    id_lat_long: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_restaurante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

LatLong.belongsTo(Usuario, {
  foreignKey: "id_user",
  foreignKeyConstraint: true,
});
LatLong.belongsTo(Restaurante, {
    foreignKey: "id_restaurante",
    foreignKeyConstraint: true,
  });

module.exports = LatLong;
