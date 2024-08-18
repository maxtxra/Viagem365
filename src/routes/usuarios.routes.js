const { Router, query } = require('express')
const Usuarios = require('../models/usuarios')

const { auth } = require('../middleware/auth')

const usuarioRoutes = new Router()


// encontrar todos usuários
usuarioRoutes.get("/", auth, async (req, res) => {
    try {
        const listaUsuarios = await Usuarios.findAll();
        res.json(listaUsuarios);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Houve um problema ao encontrar os usuários" });
    }
});

// adicionar novo usuário
usuarioRoutes.post("/", async (req, res) => {
    try {
        const {
            password, name, lname, email, gender,
            dt_birth, phone, post_code, document_number,
            city, statecountry, country
        } = req.body;

        const requiredFields = {
            password, name, lname, email, gender,
            dt_birth, phone, post_code, document_number,
            city, statecountry, country
        };
        const errors = {};

        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                errors[key] = `Você precisa adicionar o parâmetro: ${key.charAt(0) + key.slice(1)} pois é obrigatório`;
            }
        }

        if (!name.match(/^(.*[a-zA-Z]){3,}.*$/)) {
            errors["name"] = "Tamanho muito curto para nome.";
        }

        if (!dt_birth.match(/^\d{4}-\d{2}-\d{2}$/)) {
            errors["dt_birth"] = "A data de nascimento não está no formato correto";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ erro: errors });
        }

        const verificausuario = await Usuarios.findOne({ where: { email } });
        if (verificausuario) {
            return res.status(400).json({ message: 'Esse endereço de email já está cadastrado.' });
        }

        const user = await Usuarios.create({
            name, lname, email, gender, dt_birth, phone,
            post_code, document_number, city, statecountry,
            country, password
        });

        res.json(`Você cadastrou com sucesso seu cadastro ${user.name}, obrigado! sua chave é ${user.id}`);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Não foi possível realizar o cadastro post" });
    }
});

// Rota para encontrar usuários específicos pelo id direto na rota
usuarioRoutes.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Usuarios.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuário não localizado" });
        }
        res.json({ usuario: user });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: "Não foi possível realizar a busca especificada, bugou daqui pra cima",
        });
    }
});

// deleta usuários por id
usuarioRoutes.delete("/:id", (req, res) => {
    const { id } = req.params;

    Usuarios.destroy({ where: { id } });

    res.status(202).json({ message: "Tudo certo! Usuário excluído com sucesso." });
});

// atualiza campos específicos do usuário usando patch
usuarioRoutes.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = await Usuarios.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuário não localizado" });
        }

        const allowedFields = [
            "name", "lname", "email", "gender", "dt_birth", "phone",
            "post_code", "document_number", "city", "statecountry", "country", "password"
        ];
        const errors = {};

        for (const key of allowedFields) {
            if (updates[key] !== undefined) {
                if (key === "dt_birth" && !updates[key].match(/^\d{4}-\d{2}-\d{2}$/)) {
                    errors["dt_birth"] = "A data de nascimento não está no formato correto";
                } else {
                    user[key] = updates[key];
                }
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ erro: errors });
        }

        await user.save();

        res.json({ message: "Usuário atualizado com sucesso", user });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Não foi possível atualizar o usuário" });
    }
});

// busca por parametros do usuario
usuarioRoutes.get("/", async (req, res) => {
    let params = {};

    if (req.query.name) params.name = req.query.name;
    if (req.query.gender) params.gender = req.query.gender;
    if (req.query.country) params.country = req.query.country;
    if (req.query.statecountry) params.statecountry = req.query.statecountry;

    if (Object.keys(params).length === 0) {
        return res.status(400).json({ message: "Parâmetro inválido, verifique sua busca" });
    }no

    const buscausuarios = await Usuarios.findAll({ where: params });

    res.json(buscausuarios);
});

module.exports = usuarioRoutes;