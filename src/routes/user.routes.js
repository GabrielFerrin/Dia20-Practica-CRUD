import { Router } from 'express'
import {
  getUserById, getUsers, createUser,
  updateUser, deleteUser
} from '../controllers/user.controller.js'

const router = Router()

router.get('/', getUsers)
router.get(':id', getUserById)
router.post('', createUser)
router.patch(':id', updateUser)
router.delete(':id', deleteUser)

export default router
