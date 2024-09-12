const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Restaurante = require("./tb_restaurante");
const StatusMesa = require("./tb_status_mesa");

const Mesa = conn.define(
  "tb_mesa",
  {
    id_mesa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    localizacao: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    id_restaurante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qrcode: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_status_mesa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: StatusMesa,
        key: "id_status_mesa",
      },
    },
  },
  { freezeTableName: true }
);

Mesa.belongsTo(Restaurante, {
  foreignKey: "id_restaurante",
  as: "restaurante",
});

Mesa.belongsTo(StatusMesa, {
  foreignKey: "id_status_mesa",
  as: "status_mesa",
});

module.exports = Mesa;