const multer = require('multer')
const path = require('path')

module.exports = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.webp') {
            return cb(new Error(`El formato de la imagen ${file.originalname} no es permitido`), false)
        }
        cb(null, true)
    }
})