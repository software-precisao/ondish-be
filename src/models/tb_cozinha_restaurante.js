const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");


const Restaurante = require("./tb_restaurante");

const CozinhaRestaurante = conn.define(
  "tb_cozinha_restaurante",
  {
    id_cozinha_restaurante: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false, 
      primaryKey: true,
    },
    nome_cozinha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_restaurante: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  },
  { freezeTableName: true }
);

CozinhaRestaurante.belongsTo(Restaurante, {
    foreignKey: "id_restaurante",
    as: "restaurante",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

module.exports = CozinhaRestaurante;