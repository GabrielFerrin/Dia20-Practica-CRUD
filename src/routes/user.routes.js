import { Router } from 'express'
import {
  getUserById, getUsers, createUser,
  updateUser, deleteUser,
  checkEmailAvailable,
  getPicture
} from '../controllers/user.controller.js'
import { imageUpload, multerError } from '../multer.js'

const router = Router()

router.get('/', getUsers)
router.get('/check-email/', checkEmailAvailable)
router.get('/picture/', getPicture)
router.get('/:id', getUserById)
router.patch('/', imageUpload.single('picture'), multerError, updateUser)
router.post('/', imageUpload.single('picture'), multerError, createUser)
router.delete('/', deleteUser)

export default router
