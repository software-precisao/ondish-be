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
    cep: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    andar: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    numero_porta: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    localizacao: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);

LatLong.belongsTo(Usuario, {
  foreignKey: "id_user",
  foreignKeyConstraint: true,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = LatLong;
