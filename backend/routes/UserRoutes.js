const express = require('express');
const router = express();

//Controllers:
const { register, login, getCurrentUser, update, getUserById } = require("../controllers/UserController")

//Middlewares:
const validate = require("../middlewares/handleValidation");
const { registerValidation, loginValidation, userUpdateValidation } = require("../middlewares/userValidation");
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");

//Routes:

//Rota de login:
router.post('/login', validate(loginValidation()), login);

//Rota de registro:
router.post('/register', validate(registerValidation()), register);

//Rota de perfil pessoal:
router.get('/profile', authGuard, getCurrentUser);

//Rota de alteração (update) de dados do usuário :
router.put('/', authGuard, validate(userUpdateValidation()), imageUpload.single("profileImage"), update);

//Rota de pegar dados de usuário qualquer da aplicação:
router.get('/:id', getUserById);

module.exports = router;