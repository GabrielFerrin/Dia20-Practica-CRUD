import express from 'express'
import morgan from 'morgan'
import { PORT } from './config.js'
import {
  createUserTable,
  dropUserTable,
  seedUsers,
  trucateUserTable
} from './controllers/user-seeder.controller.js'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from './controllers/user.controller.js'
import {
  createTesterTable,
  dropTesterTable,
  trucateTesterTable
} from './controllers/tester-seeder.controller.js'
import {
  addTester,
  availableTesterUsername,
  checkAvailableTester,
  getTesters,
  testerLogin
} from './controllers/tester.controller.js'
import { cors, corsOptions } from './controllers/helpers.js'

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(cors)
app.options('*', corsOptions)

// is alive
app.get('/is-alive', (req, res) => res.send({ success: true }))

// testers
app.get('/testers/login', testerLogin)
app.get('/testers/', getTesters)
app.get('/testers/check', checkAvailableTester)
app.get('/testers/available/:username', availableTesterUsername)
app.post('/testers/register', addTester)
// testers seeders
app.post('/testers/create-table', createTesterTable)
app.delete('/testers/drop-tester-table', dropTesterTable)
app.delete('/testers/truncate-tester-table', trucateTesterTable)

// users
app.get('/users/', getUsers)
app.get('/users/:id', getUserById)
app.post('/users/', createUser)
app.patch('/users/:id', updateUser)
app.delete('/users/:id', deleteUser)

// seeders
app.post('/users/create-user-table/', createUserTable)
app.delete('/seeder/drop-user-table', dropUserTable)
app.delete('/seeder/truncate-user-table', trucateUserTable)
app.post('/users/seed-users', seedUsers)

app.use((req, res) => {
  res.status(404).send({ message: 'Ruta no encontrada' })
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send({ message: 'Algo salio mal' })
})

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}!`)
})
