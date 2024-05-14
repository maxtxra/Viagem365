const { DataTypes } = require('sequelize');
const { connection } = require('../database/connection');

const Usuarios = connection.define('usuarios365', {
    name: {
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
    state: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'usuarios365'
});

module.exports = Usuarios;
