import multer from 'multer'
import path from 'path'
import { verifyFolders } from './controllers/helpers.js'
// import pool from './db/db.js'

const imageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { user, pass } = req.query
    if (!user || !pass) {
      cb(new Error('No se recibieron los datos del tester'))
    }
    const res = await verifyFolders(user, pass)
    if (res.errorCode) return cb(new Error(res.message))
    cb(null, 'pictures/' + res.table)
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + path.extname(file.originalname)
    req.body.picture = fileName
    cb(null, fileName)
  }
})

const imageLimits = {
  // límite 4MB
  fileSize: 1024 * 1024 * 4, files: 1
}

const imageFilter = (req, file, cb) => {
  if (file.mimetype.includes('image')) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

export const imageUpload = multer({
  storage: imageStorage,
  limits: imageLimits,
  fileFilter: imageFilter
})

export const multerError = (err, req, res, next) => {
  if (err) {
    let message = 'La foto supera el límite de 4MB'
    if (err.code === 'LIMIT_FILE_SIZE') {
      console.log('Multer error:', err.code)
      return res.status(400).send({ success: false, message })
    } else {
      message = 'Error al subir la imagen (file manager)'
      return res.status(500).send({ success: false, message })
    }
  }
}
