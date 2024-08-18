const { Router, query } = require('express')
const { sign } = require('jsonwebtoken');
const Usuarios = require('../models/usuarios')
const { auth } = require('../middleware/auth')

const loginRoutes = new Router()


loginRoutes.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ messagem: "O Email é obrigatório." });
        }
        if (!password) {
            return res.status(400).json({ messagem: "É obrigatório uso de senha" });
        }

        const usuario = await Usuarios.findOne({ where: { email, password }});

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        const payload = {sub:usuario.id, email: usuario.email, nome: usuario.nome}
        const token = sign(payload, process.env.SECRET_JWT,{
            expiresIn: 120
        })
        res.status(200).json({Token:token})

      
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Algo deu errado, de novo." });
    }
});

module.exports = loginRoutes;