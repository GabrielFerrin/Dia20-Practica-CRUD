import express from 'express'
import morgan from 'morgan'
// local imports
import { cors, corsOptions } from './controllers/helpers.js'
// routes
import userRoutes from './routes/user.routes.js'
import testerRoutes from './routes/testers.routes.js'
import userSeederRoutes from './routes/user-seeder.routes.js'

// config
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(cors)
app.options('*', corsOptions)

// is alive
app.get('/is-alive', (req, res) => res.send({ success: true }))

// testers
app.use('/testers', testerRoutes)

// users
app.use('/users', userRoutes)

// user seeders
app.use('/users-seeder', userSeederRoutes)

app.use((req, res) => {
  res.status(404).send({ message: 'Ruta no encontrada' })
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send({ message: 'Algo salio mal' })
})

export default app
