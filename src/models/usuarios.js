const { DataTypes } = require('sequelize');
const { connection } = require('../database/connection');

const Usuarios = connection.define('usuarios', {
    name: {
        type: DataTypes.STRING
    },
    lname: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    gender: {
        type: DataTypes.STRING
    },
    document_number: {
        type: DataTypes.STRING
    },
    dt_birth: {
        type: DataTypes.DATE
    },
    phone: {
        type: DataTypes.STRING
    },
    post_code: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    statecountry: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

}, {
    tableName: 'usuarios'
});





module.exports = Usuarios;
