const express = require('express') 
const cors = require('cors') 
const { connection } = require('./database/connection') // Configuração de acesso ao banco de dados
const routes = require('./routes/routes')

const PORT_API = process.env.PORT_API 

class Server {
  constructor (server = express())// Argumento do constructor auto iniciado da aplicação para usarmos as devidas funções do express
  { 
    this.middlewares(server) // Instância do argumento da função para a função middlewares
    this.database()  // Instância da função database
    server.use(routes) // routes js
    this.initializeServer(server) // Instância da função initializeServer
  }

  async middlewares(app) {
    app.use(cors()) // Utilização da função cors dentro do servidor
    app.use(express.json()) // Habilitar entrada de dados como json no servidor
  }

  async database() {
    try {
      await connection.authenticate(); 
      console.log('Conexão bem sucedida!');
      console.log('Conexão Aleluia!');
    } catch (error) {
      console.error('Não foi possível conectar no banco de dados arruma isso aí.', error);
      throw error
    }
  }
  async initializeServer(app) {
    // Valor da porta do servidor
    app.listen(PORT_API, () => console.log(`Servidor executando na porta ${PORT_API}`)) // Execução do servidor
  }
}

module.exports = { Server } // Exportação da Classe Server