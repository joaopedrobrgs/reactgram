const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({
    //Local/Destino de armazenamento da imagem:
    destination: (req, file, cb) => {
        let folder = "";
        //Determinando se a imagem vai ser salva na pasta "users" ou na 
        // pasta "photos" com base na requisição do usuário:
        if (req.baseUrl.includes("users")) {
            folder = "users";
        } else if (req.baseUrl.includes("photos")) {
            folder = "photos";
        }
        //Determinando local/destino de armazenamento da imagem: 
        cb(null, `uploads/${folder}/`)
    },
    //Nome do arquivo que será armazenado:
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    //filtro para fazer upload apenas de arquivos nos formatos jpg e png
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg)$/)){
            return cb(new Error("Por favor, envie apenas png ou jpg!"))
        }
        cb(undefined, true)
    }
})

module.exports = { imageUpload };
