const express = require('express');
const router = express();

//Controller
const { insertPhoto } = require('../controllers/PhotoController');

//Middlewares
const { photoInsertValidation } = require('../middlewares/photoValidation');
const validate = require('../middlewares/handleValidation');
const authGuard = require('../middlewares/authGuard');
const { imageUpload } = require('../middlewares/imageUpload');

//Routes
router.post('/', authGuard, imageUpload.single("image"), validate(photoInsertValidation()), insertPhoto);

module.exports = router;