const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");
const Usuario = require("./tb_usuarios");
const Sala = require("./tb_sala");
const Restaurante = require("./tb_restaurante");

const SalaConvidado = conn.define("tb_sala_convidado", {
  id_sala: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Sala,
      key: 'id_sala'
    }
  },
  id_usuario_convidado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_user'
    }
  },
  numero_mesa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_restaurante: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, { freezeTableName: true });

SalaConvidado.belongsTo(Restaurante, {
  foreignKey: "id_restaurante",
  as: "restaurante",
});

Sala.belongsToMany(Usuario, { through: SalaConvidado, as: 'convidados', foreignKey: 'id_sala' });
Usuario.belongsToMany(Sala, { through: SalaConvidado, as: 'salas', foreignKey: 'id_usuario_convidado' });

module.exports = SalaConvidado;