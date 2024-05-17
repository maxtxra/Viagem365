const { DataTypes } = require('sequelize');
const {connection} = require ('../database/connection');


connection.define('destinos365', {
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING
    },
   coordenates: {
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
});

module.exports = Destinos