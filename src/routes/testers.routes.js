import { Router } from 'express'
import {
  testerLogin, getTesters, checkAvailableTester,
  availableTesterUsername, addTester
} from '../controllers/tester.controller.js'
import {
  createTesterTable, dropTesterTable, trucateTesterTable
} from '../controllers/tester-seeder.controller.js'

const router = Router()

router.get('login', testerLogin)
router.get('', getTesters)
router.get('check', checkAvailableTester)
router.get('available/:username', availableTesterUsername)
router.post('register', addTester)
// testers seeders
router.post('create-table', createTesterTable)
router.delete('drop-tester-table', dropTesterTable)
router.delete('truncate-tester-table', trucateTesterTable)

export default router
