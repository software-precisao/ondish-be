const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");
const Usuario = require("./tb_usuarios");
const Restaurante = require("./tb_restaurante");
const Mesa = require("./tb_mesa");

const ChamadoGarcom = conn.define(
  "tb_chamadas_garcom",
  {
    id_chamado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_mesa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_restaurante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Pendente",
    },
    horario_chamado: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { freezeTableName: true }
);

ChamadoGarcom.belongsTo(Usuario, {
  foreignKey: "id_user",
  as: "usuario",
  foreignKeyConstraint: true,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ChamadoGarcom.belongsTo(Restaurante, {
  foreignKey: "id_restaurante",
  as: "restaurante",
  foreignKeyConstraint: true,
});

ChamadoGarcom.belongsTo(Mesa, {
  foreignKey: "id_mesa",
  as: "mesa",
  foreignKeyConstraint: true,
});
module.exports = ChamadoGarcom;
