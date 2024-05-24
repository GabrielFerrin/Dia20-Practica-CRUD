import { Router } from 'express'
import {
  createUserTable, dropUserTable, trucateUserTable,
  seedUsers
} from '../controllers/user-seeder.controller.js'

const router = Router()

router.post('/users/create-user-table/', createUserTable)
router.delete('/seeder/drop-user-table', dropUserTable)
router.delete('/seeder/truncate-user-table', trucateUserTable)
router.post('/users/seed-users', seedUsers)

export default router
