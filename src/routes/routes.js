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

routes.get('/usuarios', async (req, res) => {
    try {

    const findUsers = await Usuarios.findAll()

    res.json(findUsers)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: 'Houve um problema ao encontrar os usuários'})
    }
}); // encontrar todos users


routes.get('/usuarios/:id', async (req, res) => {
    try {
        const {id} = req.params
        const user = await Usuarios.findByPk(id)
        
        if(!user){
           return res.status(404).json({message: "Usuário não localizado"}) 
        }
        res.json({
            usuario:user
        })       

    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: 'Não foi possível realizar a busca especificada, bugou daqui pra cima'})
    }
}); // usuario por id

routes.post('/usuarios', async (req,res) => {
    try {
    // embaixo é = const { password, email, name, gender, dt_birth, phone, post_code, document_number, city, statecountry, country } = req.body;
    const password = req.body.password
    const name = req.body.name
    const email = req.body.email
    const gender = req.body.gender
    const dt_birth = req.body.dt_birth
    const phone = req.body.phone
    const post_code = req.body.post_code
    const document_number = req.body.document_number
    const city = req.body.city
    const statecountry = req.body.statecountry
    const country = req.body.country
    const requiredFields = { password, name, email, gender, dt_birth, phone, post_code, document_number, city, statecountry, country };
    const errors = {};

    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value) {
            errors[key] = `${key.charAt(0) + key.slice(1)} é obrigatório`;
        }
    }
    if (!dt_birth.match(/^\d{4}-\d{2}-\d{2}$/)) { //verifica o formato de data em regex ano-mes-dia
        errors['dt_birth'] = 'A data de nascimento não está no formato correto';
    }

    //valida a senha em regex
    if (!password.match(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=(?:.*\d){6})(?=(?:.*[a-z]){1})[A-Za-z\d!@#$&*]{8,64}$/)) {
        errors['password'] = 'Password não atende aos critérios de segurança: 1 letra em maiúsculo, 1 caractere especial(!@#%) 6 números (mínimo) 1 letra maiúscula. Tente novamente';
    }


    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ erro: errors });
    }







  const user =  await Usuarios.create({
        name: name,
        email: email,
        gender: gender,
        dt_birth: dt_birth,
        phone: phone,
        post_code: post_code,
        document_number: document_number,
        city: city,
        statecountry: statecountry,
        country: country,
        password: password,
    });

    res.json(`Você cadastrou com sucesso seu cadastro ${user.name}, obrigado! sua chave é ${user.id}`)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: 'Não foi possível realizar o cadastro'})
    }
});




routes.delete('/usuarios/:id', (req, res) => {
    const {id} = req.params

    Usuarios.destroy({
        where: {
            id: id
        }
    })// deletar user onde id = 1

    res.status(202).json({message:"Tudo certo! Usuário excluído com sucesso."})
})


routes.patch('/usuarios/:id', async (req, res) => { //atualiza campos específicos
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = await Usuarios.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuário não localizado" });
        }

        const allowedFields = ['name', 'email', 'gender', 'dt_birth', 'phone', 'post_code', 'document_number', 'city', 'statecountry', 'country'];
        const errors = {};

        // Validate and update only provided fields
        for (const key of allowedFields) {
            if (updates[key] !== undefined) {
                if (key === 'dt_birth' && !updates[key].match(/^\d{4}-\d{2}-\d{2}$/)) {
                    errors['dt_birth'] = 'A data de nascimento não está no formato correto';
                } else {
                    user[key] = updates[key];
                }
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ erro: errors });
        }

        await user.save();

        res.json({
            message: "Usuário atualizado com sucesso",
            user: user
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Não foi possível atualizar o usuário" });
    }
});


routes.get('/busca', async (req, res) => {
    let params = {}

    if(req.query.name) {
        params = {...params, name: req.query.name}
    }

    if (Object.keys(params).length === 0) {
        return res.status(400).json({ message: "Paramêtro inválido, verifique sua busca" });
    }

    const buscausuarios = await Usuarios.findAll({
        where: params
    })

    res.json(buscausuarios)
})

/* Rotas de Login  */

routes.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        if (!email){
            return res.status(400).json({messagem: 'O Email é obrigatório.'})
        }
        if (!password){
            return res.status(400).json({messagem: 'É obrigatório uso de senha'})
        }
        
        const usuario = await Usuarios.findOne({
            where : {email: email, password:password}
        })
        if(!usuario) {
            return res.status(404).json({message:'Usuário não encontrado.'})
        }

        res.status(200).json({mensagem:"Esse é seu token JWT: JWT"})

    } catch (error) {
        return res.status(500).json({ error:error, mensagem: 'Algo deu errado, de novo.'})
        
    }
})

module.exports = routes
