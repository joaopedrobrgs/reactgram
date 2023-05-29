const express = require('express');
const router = express();

//Controller

//Middlewares
const { photoInsertValidation } = require('../middlewares/photoValidation');
const validate = require('../middlewares/handleValidation');
const authGuard = require('../middlewares/authGuard');

//Routes

module.exports = router;