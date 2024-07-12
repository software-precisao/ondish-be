const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");
const Sala = require("./tb_sala");
const Usuario = require("./tb_usuarios");

const Pedido = conn.define("tb_pedido", {
  id_pedido: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  numero_pedido: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  id_sala: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Sala,
      key: 'id_sala'
    }
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_user'
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, { freezeTableName: true });

Pedido.belongsTo(Sala, { foreignKey: 'id_sala', as: 'sala' });
Pedido.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

module.exports = Pedido;