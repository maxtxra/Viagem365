const { Router } = require("express");
const Usuarios = require("../models/usuarios");
const Destinos = require("../models/destinos");
const { sign } = require("jsonwebtoken");
const { auth } = require("../middleware/auth");
const routes = new Router();

routes.get("/home", (req, res) => {
    res.send("Bem Vindo");
});

                                  /* Rotas dos Usuarios */

// encontrar todos usuários
routes.get("/usuarios", auth, async (req, res) => {
    try {
        const listaUsuarios = await Usuarios.findAll();
        res.json(listaUsuarios);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Houve um problema ao encontrar os usuários" });
    }
});

// adicionar novo usuário
routes.post("/usuarios", async (req, res) => {
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
routes.get("/usuarios/:id", async (req, res) => {
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
routes.delete("/usuarios/:id", (req, res) => {
    const { id } = req.params;

    Usuarios.destroy({ where: { id } });

    res.status(202).json({ message: "Tudo certo! Usuário excluído com sucesso." });
});

// atualiza campos específicos do usuário usando patch
routes.patch("/usuarios/:id", async (req, res) => {
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
routes.get("/busca", async (req, res) => {
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

                                    /* ROTAS DE LOGIN */

routes.post("/login", async (req, res) => {
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
        const token = sign(payload, process.env.SECRET_JWT)
        res.status(200).json({Token:token})

      
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Algo deu errado, de novo." });
    }
});



/* ROTAS DE DESTINOS */

// adicionar novo destino
routes.post("/destinos", async (req, res) => {
    try {
        const {
            name, description, location, coordenates,
            state, city, country
        } = req.body;

        const requiredFields = { name, description, location, coordenates, country, state, city };
        const errors = {};

        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                errors[key] = `Você precisa adicionar o parâmetro: ${key.charAt(0) + key.slice(1)} pois é obrigatório`;
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ erro: errors });
        }

        const user = await Destinos.create({
            name, description, location, coordenates,
            country, state, city
        });

        res.json(`Você cadastrou com sucesso seu cadastro ${user.name}, obrigado! sua chave é ${user.id}`);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Não foi possível realizar o cadastro post" });
    }
});

// procurar todos destinos
routes.get("/destinos", async (req, res) => {
    try {
        const listaDestinos = await Destinos.findAll();
        res.json(listaDestinos);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Houve um problema ao encontrar os destinos" });
    }
});

// encontrar destino por id
routes.get("/destinos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const destino = await Destinos.findByPk(id);

        if (!destino) {
            return res.status(404).json({ message: "Destino não encontrado" });
        }
        res.json(destino);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Não foi possível encontrar a busca especificada, tente novamente" });
    }
});

// deletar destino por id
routes.delete("/destinos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Destinos.destroy({ where: { id } });

        if (result) {
            res.status(202).json({ message: "Destino excluído com sucesso." });
        } else {
            res.status(404).json({ message: "Destino não localizado." });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Erro ao excluir o destino" });
    }
});

// Atualizar partes do destino
routes.patch("/destinos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const destino = await Destinos.findByPk(id);

        if (!destino) {
            return res.status(404).json({ message: "Destino não localizado" });
        }

        const allowedFields = ["name", "description", "location", "coordenates", "country", "state", "city"];
        const errors = {};

        for (const key of allowedFields) {
            if (updates[key] !== undefined) {
                destino[key] = updates[key];
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ erro: errors });
        }

        await destino.save();

        res.json({ message: "Destino atualizado com sucesso", destino });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Não foi possível atualizar o destino" });
    }
});


module.exports = routes;