const express = require('express');
const router = express();

//Controller
const { insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById, updatePhoto } = require('../controllers/PhotoController');

//Middlewares
const { photoInsertValidation, photoUpdateValidation } = require('../middlewares/photoValidation');
const validate = require('../middlewares/handleValidation');
const authGuard = require('../middlewares/authGuard');
const { imageUpload } = require('../middlewares/imageUpload');

//Routes
router.post('/', authGuard, imageUpload.single("image"), validate(photoInsertValidation()), insertPhoto);
router.delete('/:id', authGuard, deletePhoto);
router.put('/:id', authGuard, validate(photoUpdateValidation()), updatePhoto);
router.get('/', authGuard, getAllPhotos);
router.get('/user/:id', authGuard, getUserPhotos);
router.get('/:id', authGuard, getPhotoById);

module.exports = router;
