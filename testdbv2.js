const connection = require('./src/database/connection.js'); 

connection
  .authenticate()
  .then(() => {
    console.log(`Conexão estabelecida com sucesso. ${connection.username}`);
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });
