const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../../data/conn");

const Usuario = require("./tb_usuarios");

const Restaurante = conn.define(
  "tb_restaurante",
  {
    id_restaurante: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nif: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nome_restaurante: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ibam: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefone1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefone2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    morada: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_morada: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigo_postal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qrcode: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stripe_account_id: {
      type: DataTypes.STRING,
      allowNull: true, // Pode ser nulo inicialmente
    },
    mcc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);

Restaurante.belongsTo(Usuario, {
  foreignKey: "id_user",
  foreignKeyConstraint: true,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Restaurante;
