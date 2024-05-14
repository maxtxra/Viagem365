const { Sequelize } = require('sequelize'); 
const databaseConfig = require('../config/database.config').development; // Importação do objeto de acesso ao banco de dados

const connection = new Sequelize(databaseConfig);

module.exports = {connection}