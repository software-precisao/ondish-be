const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");

const Mesa = require("./tb_mesa");

const MotivoVisita = conn.define(
  "tb_motivo_visita",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_mesa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    motivo_visita: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { freezeTableName: true }
);

MotivoVisita.belongsTo(Mesa, {
  foreignKey: "id_mesa",
  as: "mesa",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = MotivoVisita;
