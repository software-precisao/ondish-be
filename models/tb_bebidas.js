const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Restaurante = require("./tb_restaurante");

const Bebida = conn.define(
  "tb_bebidas",
  {
    id_bebida: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo_bebida: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    id_restaurante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

Bebida.belongsTo(Restaurante, {
  foreignKey: "id_restaurante",
  as: "restaurante",
});




module.exports = Bebida;