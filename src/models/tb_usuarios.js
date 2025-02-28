const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");

const Nivel = require("./tb_nivel");
const Status = require("./tb_status");

const Usuario = conn.define(
  "tb_usuario",
  {
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
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
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
    token_notification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripeAccountId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nif: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    data_nascimento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logradouro: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numeo_morada: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);

Usuario.belongsTo(Nivel, {
  foreignKey: "id_nivel",
  foreignKeyConstraint: true,
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Usuario.belongsTo(Status, {
  foreignKey: "id_status",
  foreignKeyConstraint: true,
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

module.exports = Usuario;
