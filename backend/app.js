require('dotenv').config();

const express = require('express'); //framework do nodeJS para facilitar no desenvolvimento
const path = require('path'); //extensão para criar rotas
const cors = require('cors'); //extensão para aceitar requisições de outras portas (importante para desenvolvermos com REACT ao mesmo tempo)

const PORT = process.env.PORT //porta que será utilizada

const app = express(); //servidor

//Configurando servidor para aceitar requisições da porta 3000 (react app):
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//Configurando servidor para ter acesso a arquivos estáticos que serão carregados pelos usuários:
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

//importando arquivo com a configuração do banco de dados:
require("./config/db.js")

//Configurando servidor para entender tanto requisições com JSON quanto com formulário:
app.use(express.json()); //json
app.use(express.urlencoded({ extended: false })); //form

//Importando e utilizando as rotas:
//!Rotas devem ficar abaixo de qualquer outra coisa que for usada no app, como, por exemplo, o método "express.json()"
const router = require('./routes/Router.js');
app.use(router);

//Rodando servidor:
app.listen(PORT, () => {
    console.log(`App rodando na porta ${PORT}`);
});