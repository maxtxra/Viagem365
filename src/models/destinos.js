const { DataTypes } = require('sequelize');
const { connection } = require('../database/connection');
const Usuarios = require('./usuarios');

const Destinos = connection.define('destinos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    location: {
        type: DataTypes.STRING
    },
    coordenates: {
        type: DataTypes.TEXT
    },
    country: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuarios,
            key: 'id'
        }
    }
}, {
    tableName: 'destinos'
});

Destinos.belongsTo(Usuarios, { foreignKey: 'userId' });
Usuarios.hasMany(Destinos, { foreignKey: 'id' });

module.exports = Destinos;
