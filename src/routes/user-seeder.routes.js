import { Router } from 'express'
import {
  createUserTable, dropUserTable, trucateUserTable,
  seedUsers
} from '../controllers/user-seeder.controller.js'

const router = Router()

router.post('/create-user-table/', createUserTable)
router.delete('/drop-user-table', dropUserTable)
router.delete('/truncate-user-table', trucateUserTable)
router.post('/seed-users', seedUsers)

export default router
