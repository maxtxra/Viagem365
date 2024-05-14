const { Router } =require('express')
const Usuarios = require('../models/usuarios')

const routes = new Router();


// GET - Lista alguma coisa
// POST - Cria/adiciona algo
// PUT - Atualiza algo como uma coluna/variavel de dados
// DELETE - deleta algo
// PATCH - depois disso faz isso


//criar uma rota
//tipo
//path
//implementação


routes.get('/home', (req, res) => {
    res.send('Bem Vindo')
});

routes.post('/usuarios', async (req,res) => {

    const id = req.body.id
    const name = req.body.name
    const email = req.body.email
    const gender = req.body.gender
    const dt_birth = req.body.dt_birth
    const phone = req.body.phone
    const post_code = req.body.post_code
    const document_number = req.body.document_number
    const city = req.body.city
    const statecountry = req.body.state
    const country = req.body.country

    
  const usuarios =  await Usuarios.create({
        name: name,
        email: email,
        gender: gender,
        dt_birth: dt_birth,
        phone: phone,
        post_code: post_code,
        document_number: document_number,
        city: city,
        state: statecountry,
        country: country,
    });
    res.json(`Você cadastrou com sucesso seu cadastro ${usuarios.name}, obrigado! sua chave é ${usuarios.id}`)
});

module.exports = routes
