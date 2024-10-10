const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Nivel = require("./tb_nivel");
const Status = require("./tb_status");

const Usuario = conn.define("tb_usuario", {
  id_user: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sobrenome: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numero_telefone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_nivel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_status: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  config: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

}, { freezeTableName: true });


Usuario.belongsTo(Nivel, {
  foreignKey: "id_nivel",
  foreignKeyConstraint: true,
});

Usuario.belongsTo(Status, {
  foreignKey: "id_status",
  foreignKeyConstraint: true,
});

module.exports = Usuario;