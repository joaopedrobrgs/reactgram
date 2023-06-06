//Importando mongoose:
const mongoose = require("mongoose");

//Importando objeto Schema:
const { Schema } = mongoose;

//Criando Schema para nosso model:
const userSchema = new Schema({
    //Nome do usuário:
    name: String,
    //Email do usuário:
    email: String,
    //Senha do usuário:
    password: String,
    //Caminho ("path") até imagem de perfil do usuário:
    profileImage: String,
    //Biografia do usuário:
    bio: String,
},
    {
        //Pegando data e hora da criação/edição de um usuário
        timestamps: true
    }
);

//Criando de fato nosso model:
const User = mongoose.model("User", userSchema);

//Exportando nosso model:
module.exports = User;

//!Model vai ser parecido com uma class. Ele será uma 
//!estrutura a partir da qual vamos criar novas instâncias.