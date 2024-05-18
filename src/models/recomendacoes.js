const { DataTypes } = require('sequelize');
const { connection } = require('../database/connection');
const Usuarios = require('./usuarios');
const Destinos = require('./destinos');

const Recomendacoes = connection.define('recomendacoes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    recommendation: {
        type: DataTypes.TEXT
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuarios,
            key: 'id'
        }
    },
    destinoId: {
        type: DataTypes.INTEGER,
        references: {
            model: Destinos,
            key: 'id'
        }
    }
}, {
    tableName: 'recomendacoes'
});

Recomendacoes.belongsToMany(Usuarios, { foreignKey: 'userId' });
Recomendacoes.belongsToMany(Destinos, { foreignKey: 'destinoId' });
Usuarios.hasMany(Recomendacoes, { foreignKey: 'userId' });
Destinos.hasMany(Recomendacoes, { foreignKey: 'destinoId' });

module.exports = Recomendacoes;
