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
  fileSize: 1024 * 1024 * 5, files: 1
}

const imageFilter = (req, file, cb) => {
  console.log('From middleware:', file.mimetype)
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
