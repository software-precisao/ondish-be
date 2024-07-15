const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Pedido = require("./tb_pedido");
const Prato = require("./tb_pratos");
const Opcao = require("./tb_opcoes");
const Bebida = require("./tb_bebidas");

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

ItensPedido.belongsTo(Pedido, {
  foreignKey: "id_pedido",
  as: "pedido",
});

ItensPedido.belongsTo(Prato, {
  foreignKey: "id_prato",
  as: "prato",
});

ItensPedido.belongsTo(Bebida, {
  foreignKey: "id_bebida",
  as: "bebida",
});

const ItensPedidoOpcoes = conn.define(
  "tb_itens_pedido_opcoes",
  {
    id_item_pedido: {
      type: DataTypes.INTEGER,
      references: {
        model: ItensPedido,
        key: 'id_item_pedido',
      },
    },
    id_opcao: {
      type: DataTypes.INTEGER,
      references: {
        model: Opcao,
        key: 'id_opcao',
      },
    },
  },
  { freezeTableName: true }
);

ItensPedido.belongsToMany(Opcao, {
  through: ItensPedidoOpcoes,
  as: 'opcoes',
  foreignKey: 'id_item_pedido',
});

Opcao.belongsToMany(ItensPedido, {
  through: ItensPedidoOpcoes,
  as: 'itens_pedido',
  foreignKey: 'id_opcao',
});

module.exports = ItensPedido;
module.exports = ItensPedidoOpcoes;