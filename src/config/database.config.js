const { config } = require('dotenv')
config();

module.exports = {
  development: {
  dialect: process.env.DIALECT, 
  host: process.env.HOST, //Qual servidor está utilizando;
  username: process.env.USERNAMEDB, //Qual o nome do seu usuário no postgres;
  password: process.env.PASSWORDDB, //Qual a senha do seu usuário no postgres;
  database: process.env.DATABASE, //Qual o nome do seu database no postgres;
  port: process.env.PORT //Qual porta do seu postgres (Normalmente é a 5432);
  },
  test: {
    dialect: process.env.DIALECT, 
  host: process.env.HOST, 
  username: process.env.USERNAMEDB, 
  password: process.env.PASSWORDDB, 
  database: process.env.DATABASE, 
  port: process.env.PORT 
  },
  production: {
    dialect: process.env.DIALECT, 
    host: process.env.HOST, 
    username: process.env.USERNAMEDB, 
    password: process.env.PASSWORDDB, 
    database: process.env.DATABASE, 
    port: process.env.PORT 
  }
};