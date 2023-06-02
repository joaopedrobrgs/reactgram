const express = require('express');
const router = express();

//Controller
const { insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById, updatePhoto, likePhoto, newComment, deleteComment } = require('../controllers/PhotoController');

//Middlewares
const { photoInsertValidation, photoUpdateValidation, commentValidation } = require('../middlewares/photoValidation');
const validate = require('../middlewares/handleValidation');
const authGuard = require('../middlewares/authGuard');
const { imageUpload } = require('../middlewares/imageUpload');

//Routes
//Get Routes:
router.get('/', authGuard, getAllPhotos);
router.get('/:id', authGuard, getPhotoById);
router.get('/user/:id', authGuard, getUserPhotos);
//Post Routes:
router.post('/', authGuard, imageUpload.single("image"), validate(photoInsertValidation()), insertPhoto);
//Put Routes:
router.put('/:id', authGuard, validate(photoUpdateValidation()), updatePhoto);
router.put('/like/:id', authGuard, likePhoto);
router.put('/newcomment/:id', authGuard, validate(commentValidation()), newComment);
router.put('/deletecomment/:id', authGuard, deleteComment);
//Delete Routes:
router.delete('/:id', authGuard, deletePhoto);

module.exports = router;
