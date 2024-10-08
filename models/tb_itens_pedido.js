const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Pedido = require("./tb_pedido");
const Prato = require("./tb_pratos");
const Bebida = require("./tb_bebidas");
const Sobremesa = require("./tb_sobremesas");

const ItensPedido = conn.define(
  "tb_itens_pedido",
  {
    id_item_pedido: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_prato: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_bebida: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_sobremesa: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);

ItensPedido.belongsTo(Sobremesa, {
  foreignKey: "id_sobremesa",
  as: "sobremesa",
});

ItensPedido.belongsTo(Prato, {
  foreignKey: "id_prato",
  as: "prato",
});

ItensPedido.belongsTo(Bebida, {
  foreignKey: "id_bebida",
  as: "bebida",
});


module.exports = ItensPedido;