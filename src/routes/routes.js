const { Router } = require("express");
const Usuarios = require("../models/usuarios");
const Destinos = require("../models/destinos")
const { sign } = require("jsonwebtoken");
const { auth } = require("../middleware/auth");
const routes = new Router();

routes.get("/home", (req, res) => {
  res.send("Bem Vindo");
});


                                  /* Rotas dos Usuarios */


// encontrar todos usuários
routes.get("/usuarios", async (req, res) => {
  try {
    
    const listaUsuarios = await Usuarios.findAll();

    res.json(listaUsuarios);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ error: "Houve um problema ao encontrar os usuários" });
  }
}); 


// adicionar novo usuário

routes.post("/usuarios", async (req, res) => {
  try {
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;
    const gender = req.body.gender;
    const dt_birth = req.body.dt_birth;
    const phone = req.body.phone;
    const post_code = req.body.post_code;
    const document_number = req.body.document_number;
    const city = req.body.city;
    const statecountry = req.body.statecountry;
    const country = req.body.country;
    const lname = req.body.lname;
    const requiredFields = {
      password,
      name,
      lname,
      email,
      gender,
      dt_birth,
      phone,
      post_code,
      document_number,
      city,
      statecountry,
      country,
    };
    const errors = {};

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        errors[key] = `Você precisa adiciona o paramêtro: ${key.charAt(0) + key.slice(1)} pois é obrigatório`;
      }
    }

    if (!name.match(/^(.*[a-zA-Z]){3,}.*$/)) {

      errors["name"] = "Tamanho muito curto para nome.";
    }

    if (!dt_birth.match(/^\d{4}-\d{2}-\d{2}$/)){
    
      
      errors["dt_birth"] = "A data de nascimento não está no formato correto";
      }

      //valida a senha em regex (1)
      // if (
      // !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])(?:([0-9a-zA-Z$*&@#])(?!\1)){8,}$/)) {
      //  errors["password"] =
      //   "Password não atende aos critérios de segurança";
      // }    

      if (Object.keys(errors).length > 0) {
      return res.status(400).json({ erro: errors });

      }

      const verificausuario = await Usuarios.findOne({ where: { email: email } });
      if (verificausuario) {
        return res.status(400).json({ message: 'Esse endereço de email já está cadastrado.' });
        }
        const user = await Usuarios.create({
        name: name,
        lname: lname,
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

      res.json(
      `Você cadastrou com sucesso seu cadastro ${user.name}, obrigado! sua chave é ${user.id}`
    );
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
    res.json({
      usuario: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error:
        "Não foi possível realizar a busca especificada, bugou daqui pra cima",
    });
  }
}); 


// deleta usuarios por id
routes.delete("/usuarios/:id", (req, res) => {
  const { id } = req.params;

  Usuarios.destroy({
    where: {
      id: id,
    },
  }); // deletar user onde id = 1

  res
    .status(202)
    .json({ message: "Tudo certo! Usuário excluído com sucesso." });
});

//atualiza campos específicos do usuário usando patch, post atualiza tudo de 1 vez só
routes.patch("/usuarios/:id", async (req, res) => {
  
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = await Usuarios.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não localizado" });
    }

    const allowedFields = [
      "name",
      "lname",
      "email",
      "gender",
      "dt_birth",
      "phone",
      "post_code",
      "document_number",
      "city",
      "statecountry",
      "country",
      "password",
    ];
    const errors = {};

    // valida os campos fornecidos
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        if (key === "dt_birth" && !updates[key].match(/^\d{4}-\d{2}-\d{2}$/)) {
          errors["dt_birth"] =
            "A data de nascimento não está no formato correto";
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
      user: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Não foi possível atualizar o usuário" });
  }
});


//busca por parametros do usuario
routes.get("/busca", async (req, res) => {
  let params = {};

  if (req.query.name) {
    params = { ...params, name: req.query.name };
  }
  if (req.query.gender) {
    params = { ...params, gender: req.query.gender };
  }
  if (req.query.country) {
    params = { ...params, country: req.query.country };
  }
  if (req.query.statecountry) {
    params = { ...params, statecountry: req.query.statecountry };
  }
  

  if (Object.keys(params).length === 0) {
    return res
      .status(400)
      .json({ message: "Paramêtro inválido, verifique sua busca" });
  }

  const buscausuarios = await Usuarios.findAll({
    where: params,
  });

  res.json(buscausuarios);
});


                                    /* ROTAS DE LOGIN */
                                        
routes.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) {
      return res.status(400).json({ messagem: "O Email é obrigatório." });
    }
    if (!password) {
      return res.status(400).json({ messagem: "É obrigatório uso de senha" });
    }

    const usuario = await Usuarios.findOne({
      where: { email: email, password: password },
    });
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const payload = {
      id: usuario.id,
      email: usuario.email,
      password: usuario.password,
      name: usuario.name
    };

    const token = sign(payload, process.env.SECRET_JWT);

    res.status(200).json({ Token: token });
  } catch (error) {
    return res.status(500).json({ error: error, mensagem: "Algo deu errado, de novo." });
  }
});

module.exports = routes;


/* ROTAS DE DESTINOS */

// adicionar novo destino

routes.post("/destinos", async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const location = req.body.location;
    const coordenates = req.body.coordenates;
    const state = req.body.state;
    const city = req.body.city;
    const country = req.body.country;
    const requiredFields = {
      name,
      description,
      location,
      coordenates,
      country,
      state,
      city   
      
    };
    const errors = {};

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        errors[key] = `Você precisa adiciona o paramêtro: ${key.charAt(0) + key.slice(1)} pois é obrigatório`;
      }
    }
      if (Object.keys(errors).length > 0) {
      return res.status(400).json({ erro: errors });

      }

        const user = await Destinos.create({
        name: name,
        description: description,
        location,
        coordenates,
        country: country,
        state: state,
        city: city
      });

      res.json(
      `Você cadastrou com sucesso seu cadastro ${user.name}, obrigado! sua chave é ${user.id}`
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Não foi possível realizar o cadastro post" });
  }
});

//procurar todos destinos
routes.get("/destinos", async (req, res) => {
  try {
    
    const listaDestinos = await Destinos.findAll();

    res.json(listaDestinos);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ error: "Houve um problema ao encontrar os usuários" });
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
    const result = await Destinos.destroy({
      where: {
        id: id,
      },
    });

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

    const allowedFields = [
      "name", "description", "location", "coordenates", "country", "state", "city", "userId"
    ];
    const errors = {};

    // Valida os campos fornecidos
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        destino[key] = updates[key];
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ erro: errors });
    }

    await destino.save();

    res.json({
      message: "Destino atualizado com sucesso",
      destino: destino,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Não foi possível atualizar o destino" });
  }
});