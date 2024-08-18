const { Router } = require("express");
const usuarioRoutes = require('./usuarios.routes')
const loginRoutes = require('./login.routes')
const destinoRoutes = require('./destinos.routes')

const routes =  Router();

routes.use('/usuarios', usuarioRoutes)
routes.use('/destinos', destinoRoutes)
routes.use('/login', loginRoutes)
routes.use('/busca', usuarioRoutes)


module.exports = routes