const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");


const Restaurante = require("./tb_restaurante");
const Pedido = require("./tb_pedido");

const AtividadePedido = conn.define(
    "tb_atividades_pedido",
    {
        id_atividade_pedido: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_pedido: {
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

AtividadePedido.belongsTo(Restaurante, {
  foreignKey: "id_restaurante",
  as: "restaurante",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

AtividadePedido.belongsTo(Pedido, {
  foreignKey: "id_pedido",
  foreignKeyConstraint: true,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = AtividadePedido;
