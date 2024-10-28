const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");
const Sobremesa = require("./tb_sobremesas");

const FotoSobremesas = conn.define(
  "tb_foto_sobremesas",
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
    id_sobremesa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

FotoSobremesas.belongsTo(Sobremesa, {
  foreignKey: "id_sobremesa",
  as: "sobremesa",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Sobremesa.hasMany(FotoSobremesas, {
  foreignKey: "id_sobremesa",
  as: "imagens",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = FotoSobremesas;
