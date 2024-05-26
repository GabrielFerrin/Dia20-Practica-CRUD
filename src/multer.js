import multer from 'multer'
// import pool from './db/db.js'

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'pictures/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const imageLimits = {
  fileSize: 1024 * 1024 * 5, files: 1
}

const imageFilter = (req, file, cb) => {
  console.log('From middleware:', file.mimetype)
  if (file.mimetype.contains('image')) {
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
