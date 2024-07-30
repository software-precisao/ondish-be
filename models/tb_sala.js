const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");
const Usuario = require("./tb_usuarios");
const Restaurante = require("./tb_restaurante");

const Sala = conn.define("tb_sala", {
  id_sala: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome_sala: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_restaurante: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numero_mesa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_usuario_anfitriao: {
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
  }
}, { freezeTableName: true });

Sala.belongsTo(Restaurante, {
  foreignKey: "id_restaurante",
  as: "restaurante",
});

Sala.belongsTo(Usuario, { as: 'anfitriao', foreignKey: 'id_usuario_anfitriao' });


module.exports = Sala;