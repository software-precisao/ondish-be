const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");
const Bebida = require("./tb_bebidas");

const FotoBebidas = conn.define(
  "tb_foto_bebidas",
  {
    id_foto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_bebida: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

// Importar o modelo Bebida após definir FotoBebidas


FotoBebidas.belongsTo(Bebida, {
  foreignKey: "id_bebida",
  as: "bebida",
});

module.exports = FotoBebidas;