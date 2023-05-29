//Importando mongoose:
const mongoose = require("mongoose");

//Importando objeto Schema:
const { Schema } = mongoose;

//Criando Schema para nosso model:
const photoSchema = new Schema({

    //Caminho ("path") até a foto (arquivo de imagem) a ser postada:
    image: String,

    //Título da foto (usuário vai definir):
    title: String,

    //Array de objetos. O que vai interessar pra gente desse array é a quantidade de curtidas na
    //foto e as informações sobre o usuário que curtiu:
    likes: Array,

    //Array de objetos. O que vai interessar pra gente desse array é a quantidade de comentários na
    //foto, o conteúdo do comentário e informações sobre o usuário que o escreveu:
    comments: Array,

    //ID do usuário que postou a foto:
    userID: mongoose.ObjectId,

    //userName do usuário que postou a foto:
    userName: String,

},
    {
        //Pegando data e hora da postagem de uma foto
        timestamps: true
    }
);

//Criando de fato nosso model:
const Photo = mongoose.model("Photo", photoSchema);

//Exportando nosso model:
module.exports = Photo;

//!Model vai ser parecido com uma class. Ele será uma
//!estrutura a partir da qual vamos criar novas instâncias.