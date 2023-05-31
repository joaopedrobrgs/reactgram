const Photo = require("../models/Photo");
const User = require("../models/User");

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

//Função/Controller de inserir uma foto relacionada ao usuário que está logado:
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
        res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] });
        return;
    }

    // Se a foto foi criada corretamente, retorna-la:
    res.status(201).json(newPhoto);

}

//Função/Controller de apagar uma foto do usuário logado:
const deletePhoto = async (req, res) => {

    //Pegando ID da foto pela URL (params):
    const { id } = req.params;

    //Pegando dados do usuário que estarão disponíveis por causa da autenticação prévia:
    const reqUser = req.user;

    try {
        //Selecionando a foto no banco de dados através do ID que foi passado por params:
        const photo = await Photo.findById(new ObjectId(id));

        //Verificando se foto existe:
        if (!photo) {
            res.status(404).json({ saterrors: ["Foto não encontrada."] });
            return;
        }

        //Verificando se foto pertence ao usuário:
        if (!photo.userID.equals(reqUser._id)) {
            res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] });
            return;
        }

        try {
            //Apagando a foto do banco de dados:
            await Photo.findByIdAndDelete(photo._id);
            //Retornando ID da foto apagada ao Front End e também mensagem informando exclusão:
            res.status(200).json({ id: photo._id, message: "Foto excluída com sucesso." })
        } catch {
            res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] })
            return;
        }
    } catch {
        res.status(404).json({ errors: ["Foto não encontrada."] })
        return;
    }


}

//Função/Controller de pegar todas as fotos armazenadas no banco de dados
const getAllPhotos = async (req, res) => {

    //Buscando todas as fotos no banco de dados e ordenando-as pela data de criação:
    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec();

    //Retornando que houve um erro no sistema caso nenhuma foto seja retornada:
    if (!photos) {
        res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] })
        return;
    }

    //Se der tudo certo, retornar todas as fotos do banco de dados:
    return res.status(200).json(photos);

}

//Função/Controller de pegar todas as fotos de um usuário especifico:
const getUserPhotos = async (req, res) => {

    //Pegando ID do usuário alvo da requisição através da URL (params):
    const { id } = req.params;

    try {
        //Pegando todas as fotos do usuário utilizando o seu ID como filtro:
        const photos = await Photo.find({ userID: id }).sort([["createdAt", -1]]).exec();
        //Fazendo checagem se alguma foto foi encontrada ou não:
        if (photos.length == 0) {
            res.status(404).json({ errors: ["Usuário não possui fotos ou não foi encontrado."] })
            return;
        }
        //Fazendo checagem se houve erro do servidor na busca pelas fotos:
        if (!photos) {
            res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] })
            return;
        }
        //Retornando fotos do usuário, caso dê tudo certo:
        res.status(200).json(photos);
    } catch {
        //Retornando erro caso params não respeite os requisitos (quantidade de caracteres ou algo do gênero):
        res.status(404).json({ errors: ["Usuário não encontrado."] })
    }

}

//Função/Controller de pegar todas as fotos de um usuário especifico:
const getPhotoById = async (req, res) => {

    //Pegando ID de foto alvo da requisição através da URL (params):
    const { id } = req.params;

    try {
        //Buscando a foto no banco de dados utilizando o seu ID como filtro:
        const photo = await Photo.findById(new ObjectId(id));
        //Fazendo checagem se alguma foto foi encontrada:
        if (!photo) {
            res.status(404).json({ errors: ["Foto não encontrada."] })
            return;
        }
        //Retornando foto, se deu tudo certo:
        res.status(200).json(photo);
    } catch {
        //Fazendo checagem se alguma foto foi encontrada:
        res.status(404).json({ errors: ["Foto não encontrada."] })
    }

}

module.exports = { insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById };
