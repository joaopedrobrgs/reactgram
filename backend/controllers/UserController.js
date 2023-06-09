const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Gerando token do usuário:
const generateUserToken = (id) => {
    //método sign retorna token gerado, com base no id e no segredo do jwt:
    return jwt.sign({ id }, jwtSecret, {
        //tempo de expiração do token (logout automático depois desse tempo):
        expiresIn: "7d"
    })
}

//Função/Controller de registrar usuário:
const register = async (req, res) => {

    const { name, email, password } = req.body;

    //Checando se já existe usuário registrado com o e-mail informado:
    const user = await User.findOne({ email });
    if (user) {
        res.status(422).json({ errors: ["E-mail já registrado"] })
        return
    }

    //Gerando password hash - Criptografando senha do usuário para salvar no DB
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt)

    //Criando usuário no banco de dados
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    })

    //Checando se houve algum erro na criação do usuário (erro genérico / provavelmente do sistema):
    if (!newUser) {
        res.status(422).json({ errors: ["houve um erro, por favor tente mais tarde."] })
        return
    }

    // Se usuário foi criado corretamente, retornar o token para o FRONT END, que vai
    // ser criado a partir do ID do usuário:
    res.status(201).json({
        _id: newUser._id,
        token: generateUserToken(newUser._id)
    })

}

//Função/Controller de logar usuário:
const login = async (req, res) => {

    //pegando dados enviados pelo usuário na requisição:
    const { email, password } = req.body;

    //verificando se usuário existe (se email está cadastrado no banco de dados):
    const user = await User.findOne({ email })

    //caso email não esteja cadastrado, retornar erro informando que email 
    //ou senha estão incorretos.
    if (!user) {
        res.status(404).json({ errors: ["email e/ou senha incorretos."] });
        return;
    }

    //checando se a senha digitado pelo usuário e senha armazenada no banco de dados 
    //(criptografada) correspondem:
    let encryptedPassword = user.password;
    let checkPassword = bcrypt.compareSync(password, encryptedPassword);

    //se senhas não corresponderem, retornar erro informando que email
    //ou senha estão incorretos:
    if (!checkPassword) {
        res.status(404).json({ errors: ["email e/ou senha incorretos."] });
        return;
    }

    // Se deu tudo certo com o login, retornar o token para o FRONT END, que vai
    // ser criado a partir do ID do usuário, além da imagem do perfil do usuário,
    // se ele tiver::
    res.status(201).json({
        _id: user._id,
        token: generateUserToken(user._id),
        profileImage: user.profileImage
    })


}

//Função/Controller de pegar dados do usuário que está logado e retorna-los após autenticação:
const getCurrentUser = async (req, res) => {

    const user = req.user;

    res.status(200).json(user);

}

//Função/Controller de fazer update dos dados do usuário:
const update = async (req, res) => {

    //Pegando dados que podem ter sido alterados ou não
    const { name, password, bio } = req.body;

    //Pegando imagem do perfil que pode ter sido alterada ou não
    let profileImage = null;
    if (req.file) {
        profileImage = req.file.filename;
    }

    //Pegando usuário que fez a requisição através do token
    const reqUser = req.user;

    //Pegando correspondente do usuário cadastrado no banco de dados do MongoDB
    const user = await User.findById(new ObjectId(reqUser._id)).select("-password");

    //Alterando nome do usuário (caso seja enviado um novo nome na requisição):
    if (name) {
        user.name = name;
    }

    //Alterando senha do usuário (caso seja enviado uma nova senha na requisição):
    if (password) {
        //Gerando password hash - Criptografando senha do usuário para salvar no DB
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        //Alterando senha de fato:
        user.password = passwordHash;
    }

    //Alterando imagem de perfil do usuário (caso seja enviado uma imagem na requisição):
    if (profileImage) {
        user.profileImage = profileImage;
    }

    //Alterando bio do usuário (caso seja enviado uma nova bio na requisição):
    if (bio) {
        user.bio = bio;
    }

    try {
        //Salvando novos dados do usuário no banco de dados do mongoDB:
        await user.save();
        //Retornando dados atualizados para o Front-End:
        res.status(200).json(user);
    } catch {
        //Retornando para o Front-End que houve um erro no servidor:
        res.status(422).json({ errors: ["houve um erro, por favor tente mais tarde."] })
        return
    }

}

//Pegando usuário qualquer da aplicação pelo ID:
const getUserById = async (req, res) => {

    //Pegando ID do usuário que queremos que seja retornado através da URL:
    const { id } = req.params;

    let user = null;

    //Tentativa de buscar usuário no banco de dados:
    try {
        //Buscando usuário no banco de dados:
        user = await User.findById(new ObjectId(id)).select("-password");
        //Checando se o usuário existe:
        //Caso ele não exista, mas o params passado estiver no formato correto (mesma
        //quantidade de caracteres) o comando abaixo será executado (mensagem de erro):
        if (!user) {
            res.status(404).json({ errors: ["Usuário não encontrado."] });
            return;
        }
        //Caso ele exista, o comando abaixo será executado (dados do usuário serão retornados):
        res.status(200).json(user);
    }catch (error){
        //Caso ele não exista e o params passado estiver em um formato nada a ver,
        //o comando abaixo será executado (mensagem de erro):
        res.status(422).json({ errors: ["Usuário não encontrado."] });
        return;
    }

}

module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById
}