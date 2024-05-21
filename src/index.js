import express from 'express'
import morgan from 'morgan'
import { PORT } from './config.js'
import {
  createUserTable,
  dropUserTable,
  seedUsers,
  trucateUserTable
} from './controllers/seeder.controller.js'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from './controllers/user.controller.js'

const app = express()
app.use(morgan('dev'))
app.use(express.json())

// users
app.get('/users/', getUsers)
app.get('/users/:id', getUserById)
app.post('/users/', createUser)
app.patch('/users/:id', updateUser)
app.delete('/users/:id', deleteUser)

// seeders
app.post('/seeder/create-user-table', createUserTable)
app.delete('/seeder/drop-user-table', dropUserTable)
app.delete('/seeder/truncate-user-table', trucateUserTable)
app.post('/seeder/seed-users', seedUsers)

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}!`)
})
