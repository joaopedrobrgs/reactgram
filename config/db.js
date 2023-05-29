const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const connection = async () => {
    try {
        const dbConnection = await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@cluster0.f50088j.mongodb.net/ReactGram?retryWrites=true&w=majority`
        )
        console.log("Conectou ao banco de dados.")
        return dbConnection;
    } catch (error) {
        console.log(error);
    }
}

connection();

module.exports = connection;