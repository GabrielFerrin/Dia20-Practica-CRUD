import { Router } from 'express'
import {
  testerLogin, getTesters, checkAvailableTester,
  availableTesterUsername, addTester
} from '../controllers/tester.controller.js'
import {
  createTesterTable, dropTesterTable, trucateTesterTable
} from '../controllers/tester-seeder.controller.js'
import {
  createUserTables, dropUserTables,
  seedUsers, trucateUserTable
} from '../controllers/user-seeder.controller.js'

const router = Router()

router.get('/login', testerLogin)
router.get('', getTesters)
router.get('/check', checkAvailableTester)
router.get('/available/:username', availableTesterUsername)
router.post('/register', addTester)
// testers seeders
router.post('/create-table', createTesterTable)
router.delete('/drop-tester-table', dropTesterTable)
router.delete('/truncate-tester-table', trucateTesterTable)

// seed users
router.post('/create-user-tables/', createUserTables)
router.delete('/drop-user-tables', dropUserTables)
router.delete('/truncate-user-table', trucateUserTable)
router.post('/seed-users', seedUsers)
// seed posts

export default router
