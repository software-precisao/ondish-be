const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");

const Usuario = require("./tb_usuarios");
const Restaurante = require("./tb_restaurante");
const Sala = require("./tb_sala");
const Mesa = require("./tb_mesa");
const ItensPedido = require("./tb_itens_pedido");

const Pedido = conn.define(
  "tb_pedidos",
  {
    id_pedido: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Usuario,
        key: "id_user",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    id_restaurante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_sala: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_mesa: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    numero_pedido: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pago: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    usuario_pagante: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Usuario,
        key: "id_user",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  },
  { freezeTableName: true }
);

Pedido.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Pedido.belongsTo(Restaurante, {
  foreignKey: "id_restaurante",
  as: "restaurante",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Pedido.belongsTo(Sala, {
  foreignKey: "id_sala",
  as: "sala",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Pedido.belongsTo(Mesa, {
  foreignKey: "id_mesa",
  as: "mesa",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Pedido.hasMany(ItensPedido, {
  foreignKey: "id_pedido",
  as: "itens_pedido",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Pedido.belongsTo(Usuario, {
  foreignKey: "usuario_pagante",
  as: "pagante",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});


module.exports = Pedido;
