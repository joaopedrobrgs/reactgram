const express = require('express');
const router = express();

//Controller
const { insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById } = require('../controllers/PhotoController');

//Middlewares
const { photoInsertValidation } = require('../middlewares/photoValidation');
const validate = require('../middlewares/handleValidation');
const authGuard = require('../middlewares/authGuard');
const { imageUpload } = require('../middlewares/imageUpload');

//Routes
router.post('/', authGuard, imageUpload.single("image"), validate(photoInsertValidation()), insertPhoto);
router.delete('/:id', authGuard, deletePhoto);
router.get('/', authGuard, getAllPhotos);
router.get('/user/:id', authGuard, getUserPhotos);
router.get('/:id', authGuard, getPhotoById);

module.exports = router;