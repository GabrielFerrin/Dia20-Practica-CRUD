import { Router } from 'express'
import {
  getUserById, getUsers, createUser,
  updateUser, deleteUser,
  checkEmailAvailable,
  getPicture
} from '../controllers/user.controller.js'
import { imageUpload } from '../multer.js'

const router = Router()

router.get('/', getUsers)
router.get('/check-email/', checkEmailAvailable)
router.get('/picture/', getPicture)
router.get('/:id', getUserById)
router.post('/', imageUpload.single('picture'), createUser)
router.patch('/:id', updateUser)
router.delete('/', deleteUser)

export default router
