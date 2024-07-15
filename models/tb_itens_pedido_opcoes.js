const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const ItensPedido = require("./tb_itens_pedido");
const Opcao = require("./tb_opcoes");

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

module.exports = ItensPedidoOpcoes;