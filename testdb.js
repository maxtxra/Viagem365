const Sequelize = require('sequelize');
const dbConfig = require('./src/config/database.config.js').development; // Ajustar o caminho final do desenvolvimento conforme necessário

//  console.log para mostrar a configuração do usuario carregada
console.log("Configurações de conexão com o banco:", dbConfig.username);

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });
