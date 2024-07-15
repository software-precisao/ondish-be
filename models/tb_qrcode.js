const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../data/conn");

const Restaurante = require("./tb_restaurante");

const Qrcode = conn.define("tb_qrcode", {
    id_qrcode: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    qrcode: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    id_restaurante: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },


}, { freezeTableName: true });


Qrcode.belongsTo(Restaurante, {
    foreignKey: "id_restaurante",
    foreignKeyConstraint: true,
});



module.exports = Qrcode;