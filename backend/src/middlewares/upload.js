const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'medicamento_imagem') {
      const medDir = path.join(uploadDir, 'medicamentos');
      if (!fs.existsSync(medDir)) fs.mkdirSync(medDir, { recursive: true });
      cb(null, medDir);
    } else if (file.fieldname === 'receita_arquivo') {
      const recDir = path.join(uploadDir, 'receitas');
      if (!fs.existsSync(recDir)) fs.mkdirSync(recDir, { recursive: true });
      cb(null, recDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp/;
  const allowedDocTypes = /pdf|jpeg|jpg|png/;

  const extname = path.extname(file.originalname).toLowerCase();
  
  if (file.fieldname === 'receita_arquivo') {
    if (allowedDocTypes.test(extname)) return cb(null, true);
    return cb(new Error('Formato de arquivo não suportado. A receita deve ser PDF ou Imagem.'));
  }
  
  if (allowedImageTypes.test(extname)) {
    return cb(null, true);
  }
  
  cb(new Error('Erro: Apenas imagens são suportadas (jpeg, jpg, png, webp)!'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

module.exports = upload;
