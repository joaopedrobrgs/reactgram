const Photo = require("../models/Photo");
const User = require("../models/User");

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

//Função/Controller de inserir uma foto com um usuário relacionado a ela:
const insertPhoto = async (req, res) => {

    //Pegando título da foto
    const { title } = req.body;

    //Pegando arquivo de imagem
    const image = req.file.filename;

    //Pegando usuário que fez a requisição utilizando o token
    const reqUser = req.user;

    //Pegando correspondente do usuário cadastrado no banco de dados do MongoDB
    const user = await User.findById(new ObjectId(reqUser._id)).select("-password");

    //Criando nova foto no banco de dados:
    const newPhoto = await Photo.create({
        title,
        image,
        userID: user._id,
        userName: user.name
    })

    //Checando se houve algum erro na criação da foto (erro genérico / provavelmente do sistema):
    if (!newPhoto) {
        res.status(422).json({ errors: ["houve um erro, por favor tente mais tarde."] });
        return;
    }

    // Se a foto foi criada corretamente, retorna-la:
    res.status(201).json(newPhoto);

}

module.exports = { insertPhoto }
