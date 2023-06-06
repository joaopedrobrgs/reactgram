const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

//Criando middleware de autenticação para que o usuário tenha acesso
//a uma rota:

const authGuard = async (req, res, next) => {

    //Pegando o header da requisição do usuário:
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];    

    //Checando se o header da requisição do usuário de fato possui um token:
    if(!token){
        return res.status(401).json({errors: ["Acesso negado."]})
    }

    //Checando se esse token é válido:
    try{
        //Verificando token:
        const verified = jwt.verify(token, jwtSecret);
        //Colocando usuário na requisição para os passos seguintes da rota:
        req.user = await User.findById(verified.id).select("-password");
        //Passando para próximo passo da rota:
        next();
    }catch (error){
        res.status(401).json({errors: ["Token inválido."]})
    }

}

module.exports = authGuard;