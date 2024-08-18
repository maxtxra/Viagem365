
const { Router, query } = require('express')
const Destinos = require('../models/usuarios')

const { auth } = require('../middleware/auth')

const destinoRoutes = new Router()


// adicionar novo destino
destinoRoutes.post("/", async (req, res) => {
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
destinoRoutes.get("/", async (req, res) => {
    try {
        const listaDestinos = await Destinos.findAll();
        res.json(listaDestinos);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Houve um problema ao encontrar os destinos" });
    }
});

// encontrar destino por id
destinoRoutes.get("/:id", async (req, res) => {
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
destinoRoutes.delete("/:id", async (req, res) => {
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
destinoRoutes.patch("/:id", async (req, res) => {
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


module.exports = destinoRoutes;