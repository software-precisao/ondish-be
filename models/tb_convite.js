const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Usuario = require("./tb_usuarios");
const Pedido = require("./tb_pedido");

const Convite = conn.define(
    "tb_convite",
    {
      id_convite: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_pedido: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_usuario_convidado: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_usuario_convidante: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { freezeTableName: true }
  );
  
  Convite.belongsTo(Pedido, {
    foreignKey: "id_pedido",
    as: "pedido",
  });
  
  Convite.belongsTo(Usuario, {
    foreignKey: "id_usuario_convidado",
    as: "usuario_convidado",
  });
  
  Convite.belongsTo(Usuario, {
    foreignKey: "id_usuario_convidante",
    as: "usuario_convidante",
  });
  
  module.exports = Convite;