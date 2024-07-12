const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Usuario = require("./tb_usuarios");

const Code = conn.define(
  "tb_code",
  {
    id_code: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[0-9]{4}$/,
        }
      },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

Code.belongsTo(Usuario, {
  foreignKey: "id_user",
  foreignKeyConstraint: true,
});

module.exports = Code;
