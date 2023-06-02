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
        return res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] });
    }

    // Se a foto foi criada corretamente, retorna-la:
    return res.status(201).json(newPhoto);

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
            return res.status(404).json({ saterrors: ["Foto não encontrada."] });
        }

        //Verificando se foto pertence ao usuário:
        if (!photo.userID.equals(reqUser._id)) {
            return res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] });
        }

        try {
            //Apagando a foto do banco de dados:
            await Photo.findByIdAndDelete(photo._id);
            //Retornando ID da foto apagada ao Front End e também mensagem informando exclusão:
            return res.status(200).json({ id: photo._id, message: "Foto excluída com sucesso." })
        } catch {
            return res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] })
        }
    } catch {
        return res.status(404).json({ errors: ["Foto não encontrada."] })
    }


}

//Função/Controller de pegar todas as fotos armazenadas no banco de dados
const getAllPhotos = async (req, res) => {

    //Buscando todas as fotos no banco de dados e ordenando-as pela data de criação:
    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec();

    //Retornando que houve um erro no sistema caso nenhuma foto seja retornada:
    if (!photos) {
        return res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] })
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
            return res.status(404).json({ errors: ["Usuário não possui fotos ou não foi encontrado."] })
        }
        //Fazendo checagem se houve erro do servidor na busca pelas fotos:
        if (!photos) {
            return res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] })
        }
        //Retornando fotos do usuário, caso dê tudo certo:
        return res.status(200).json(photos);
    } catch {
        //Retornando erro caso params não respeite os requisitos (quantidade de caracteres ou algo do gênero):
        return res.status(404).json({ errors: ["Usuário não encontrado."] })
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
            return res.status(404).json({ errors: ["Foto não encontrada."] })
        }
        //Retornando foto, se deu tudo certo:
        return res.status(200).json(photo);
    } catch {
        //Fazendo checagem se alguma foto foi encontrada:
        return res.status(404).json({ errors: ["Foto não encontrada."] })
    }

}

//Função de alterar uma foto do usuário logado através do seu ID:
const updatePhoto = async (req, res) => {

    //Pegando ID da foto pela URL (params):
    const { id } = req.params;

    //Pegando novos dados da foto que virão pela requisição do usuário (permitido alterar apenas titulo):
    const { title } = req.body;

    //Pegando dados do usuário logado (que vem através do TOKEN):
    const reqUser = req.user;


    try {
        //Buscando a foto no banco de dados utilizando o seu ID como filtro:
        const photo = await Photo.findById(new ObjectId(id));
        //Fazendo checagem se alguma foto foi encontrada (params incorreto):
        if (!photo) {
            return res.status(404).json({ errors: ["Foto não encontrada."] })
        }
        //Verificando se foto pertence ao usuário:
        if (!photo.userID.equals(reqUser._id)) {
            return res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] });
        }
        //Alterando título da foto pelo título que foi enviado na requisição
        if (title) {
            photo.title = title;
        }
        try {
            //Salvando essa alteração no documento:
            await photo.save();
            //Retornando foto já modificada e mensagem informando FRONT END que deu tudo certo:
            return res.status(200).json({ photo, message: "Foto atualizada com sucesso." });
        } catch {
            //Retornando se houve erro do sistema:
            return res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] });
        }
    } catch {
        //Fazendo checagem se alguma foto foi encontrada (params fora do padrão):
        return res.status(404).json({ errors: ["Foto não encontrada."] })
    }

}

const likePhoto = async (req, res) => {

    //Pegando ID da foto pela URL (params):
    const { id } = req.params;

    //Pegando dados do usuário logado (que vem através do TOKEN):
    const reqUser = req.user;

    try {
        //Buscando a foto no banco de dados utilizando o seu ID como filtro:
        const photo = await Photo.findById(new ObjectId(id));
        //Fazendo checagem se alguma foto foi encontrada (params incorreto):
        if (!photo) {
            return res.status(404).json({ errors: ["Foto não encontrada."] })

        }
        //Checando se usuário já curtiu a foto utilizando método includes do Mongooose:
        if (photo.likes.includes(reqUser._id)) {
            //Se já tive curtida avisar FRONT END:
            return res.status(422).json({ errors: ["Você já curtiu a foto."] })
        }

        //Se não tiver curtida, adicionar ID do usuário no array de likes:
        photo.likes.push(reqUser._id)

        try {
            //Salvando essa alteração no documento:
            await photo.save();
            //Retornando ao front end: ID da foto que foi curtida, usuário que a curtiu e mensagem
            //informando que deu tudo certo:
            return res.status(200).json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida." });
        } catch {
            //Retornando se houve erro do sistema:
            return res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] });
        }
    } catch {
        //Fazendo checagem se alguma foto foi encontrada (params fora dos padrões):
        return res.status(404).json({ errors: ["Foto não encontrada."] });
    }

}

const newComment = async (req, res) => {
    //Pegando ID da foto pela URL (params):
    const { id } = req.params;
    //Pegando dados do usuário logado (que vem através do TOKEN):
    const reqUser = req.user;
    //Pegando texto do comentário que virá pelo corpo da requisição (esse texto já foi validado por um 
    //middleware, então, obrigatoriamente, vai existir):
    const { text } = req.body;
    try{
        //Buscando a foto no banco de dados utilizando o seu ID como filtro:
        const photo = await Photo.findById(new ObjectId(id));
        //Fazendo checagem se alguma foto foi encontrada (params incorreto):
        if(!photo){
            return res.status(404).json({errors: ["Foto não encontrada."]})
        }
        //Montando comentário, com texto que foi enviado na requisição, dados do usuário que fez a requisição 
        //(usuário logado) e data de criação:
        const comment = {
            text,
            userName: reqUser.name,
            userImage: reqUser.profileImage,
            userID: reqUser._id,
            commentID: `${reqUser._id}-${Date.now()}`,
            createdAt: new Date()
        };
        //Adicionando comentário do usuário no array de comentário:
        photo.comments.push(comment)
        try{
            //Salvando essa alteração no documento:
            await photo.save();
            //Retornando ao front end: ID da foto que foi curtida, dados do comentário e mensagem
            //informando que deu tudo certo:
            return res.status(200).json({photoId: id, comment, message: "A foto foi comentada." })
        }catch{
            //Retornando se houve erro do sistema:
            return res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] });
        }
    }catch{
        //Fazendo checagem se alguma foto foi encontrada (params fora dos padrões):
        return res.status(404).json({errors: ["Foto não encontrada."]})
    }
}

const deleteComment = async (req, res) => {
    //Pegando ID da foto pela URL (params):
    const {id} = req.params;
    //Pegando dados do usuário logado (que vem através do TOKEN):
    const reqUser = req.user;
    //Pegando ID do comentário que vai ser apagado. Esse ID virá pelo corpo da requisição e vai
    //ser validado mais a frente:
    const {commentID} = req.body;
    try{
        //Buscando a foto no banco de dados utilizando o seu ID como filtro:
        const photo = await Photo.findById(new ObjectId(id));
        //Fazendo checagem se alguma foto foi encontrada (params incorreto):
        if(!photo){
            return res.status(404).json({errors: ["Foto não encontrada."]})
        }
        //Fazendo checagem se algum ID foi enviado no corpo da requisição:
        if(!commentID){
            return res.status(404).json({errors: ["Comentário não existe ou não foi encontrado."]})
        }
        //Fazendo checagem se ID que foi enviado na requisição corresponde com o ID de algum comentário
        //da foto:
        const checkingIfCommentExists = photo.comments.filter(element => {
            return element.commentID == commentID
        })
        if(!checkingIfCommentExists || checkingIfCommentExists.length == 0){
            return res.status(404).json({errors: ["Comentário não existe ou não foi encontrado."]})
        }
        //Filtrando comentários da foto, para que sejam retornados apenas os que tiverem um ID diferente:
        const filteredComments = photo.comments.filter(element => {
            return element.commentID !== commentID
        })
        if(filteredComments && filteredComments !== undefined){
            photo.comments = filteredComments;
        }
        try{
            //Salvando essa alteração no documento:
            await photo.save();
            //Retornando ao front end: ID da foto que teve o comentário apagado, comentários atualizados e 
            //mensagem informando que deu tudo certo:
            return res.status(200).json({photoId: id, comments: photo.comments, message: "O comentário foi apagado."})
        }catch{
            //Retornando se houve erro do sistema:
            return res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] });
        }
    }catch{
        //Fazendo checagem se alguma foto foi encontrada (params fora dos padrões):
        return res.status(404).json({errors: ["Foto não encontrada."]})
    }
}

module.exports = { insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById, updatePhoto, likePhoto, newComment, deleteComment };

