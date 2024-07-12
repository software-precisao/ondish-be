const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Usuario = require("./tb_usuarios");
const Veiculo = require("./tb_veiculo");

const Estafeta = conn.define("tb_estafeta", {
    id_estafeta: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nif: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [1, 12]
        }
    },
    numero_carta: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    matricula: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    seguro: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    documento: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nacionalidade: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id_veiculo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

}, { freezeTableName: true });


Estafeta.belongsTo(Usuario, {
    foreignKey: "id_user",
    foreignKeyConstraint: true,
});

Estafeta.belongsTo(Veiculo, {
    foreignKey: "id_veiculo",
    foreignKeyConstraint: true,
});




module.exports = Estafeta;