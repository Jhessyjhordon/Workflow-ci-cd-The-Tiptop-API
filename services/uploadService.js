const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier de stockage pour les photos
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 } // Limite de taille du fichier (1 Mo ici)
}).single('profilePhoto'); // Champ de formulaire pour le fichier

module.exports = {
  upload,
};
