const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");
const Pedido = require("./tb_pedido");
const Pratos = require("./tb_pratos");
const Opcoes = require("./tb_opcoes");
const Bebida = require("./tb_bebidas");

const PedidoItem = conn.define(
  "tb_pedido_item",
  {
    id_pedido_item: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Pedido,
        key: "id_pedido",
      },
    },
    id_prato: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Pratos,
        key: "id_pratos",
      },
    },
    id_opcao: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Opcoes,
        key: "id_opcoes",
      },
    },
    id_bebida: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Bebida,
        key: "id_bebida",
      },
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

PedidoItem.belongsTo(Pedido, { foreignKey: "id_pedido", as: "pedido" });
PedidoItem.belongsTo(Pratos, { foreignKey: "id_prato", as: "prato" });
PedidoItem.belongsTo(Opcoes, { foreignKey: "id_opcao", as: "opcao" });
PedidoItem.belongsTo(Bebida, { foreignKey: "id_bebida", as: "bebida" });

module.exports = PedidoItem;
