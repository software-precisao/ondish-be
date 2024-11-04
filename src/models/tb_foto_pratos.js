const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");

const Pratos = require("./tb_pratos");

const FotoPratos = conn.define(
  "tb_foto_prato",
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
    id_pratos: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

FotoPratos.belongsTo(Pratos, {
  foreignKey: "id_pratos",
  as: "prato",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = FotoPratos;
