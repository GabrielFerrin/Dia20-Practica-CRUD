import express from 'express'
import morgan from 'morgan'
// local imports
import { checkStorage, cors, corsOptions, eliminateStorage } from './controllers/helpers.js'
// routes
import userRoutes from './routes/user.routes.js'
import testerRoutes from './routes/testers.routes.js'
import userSeederRoutes from './routes/user-seeder.routes.js'

// config
const app = express()
app.use(morgan('dev'))
app.use(express.json())
// cors
app.use(cors)
app.options('*', corsOptions)

// is alive
app.get('/is-alive', (req, res) => res.send({ success: true }))
// chek storage
app.get('/check-storage-size', checkStorage)
app.delete('/eliminate-sotrage', eliminateStorage)

// testers
app.use('/testers', testerRoutes)
// users
app.use('/users', userRoutes)
// user seeders
app.use('/users-seeder', userSeederRoutes)
// 404
app.use((req, res) => {
  res.status(404).send({ message: 'Ruta no encontrada' })
})
// hanle unhandled errors
app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(500).send({ success: false, message: err.message })
})
// export
export default app
