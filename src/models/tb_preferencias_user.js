const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");

const Usuario = require("./tb_usuarios");

const PreferenciasUsuario = conn.define(
  "tb_preferencias_usuario",
  {
    id_preferencia_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notificacoes_pedido: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    notificacoes_dicas_e_promocao: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    email_dicas_e_promocao: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    notificacoes_ofertas_parceiros: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    email_ofertas_parceiros: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  { freezeTableName: true }
);

PreferenciasUsuario.belongsTo(Usuario, {
  foreignKey: "id_user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = PreferenciasUsuario;
