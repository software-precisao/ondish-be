const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");


const Restaurante = require("./tb_restaurante");
const Sala = require("./tb_sala");

const AtividadeSala = conn.define(
    "tb_atividades_sala",
    {
        id_atividade_sala: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_sala: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        id_restaurante: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    { freezeTableName: true }
);

AtividadeSala.belongsTo(Restaurante, {
  foreignKey: "id_restaurante",
  as: "restaurante",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

AtividadeSala.belongsTo(Sala, {
  foreignKey: "id_sala",
  as: "sala",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = AtividadeSala;