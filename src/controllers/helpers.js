import fs from 'fs/promises'
import pool from '../db/db.js'

export const cors = (req, res, next) => {
  const origin = req.headers.origin || req.headers.host
  const allowedOrigins = new Set([
    'http://127.0.0.1:5500',
    'https://funval-users-fe.onrender.com'
  ])
  // console.log('Complete url:', origin + req.originalUrl)
  const isAllowed = allowedOrigins.has(origin)
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : '')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

export const corsOptions = (req, res) => {
  const origin = req.headers.origin || req.headers.host
  const allowedOrigins = new Set([
    'http://127.0.0.1:5500',
    'https://funval-users-fe.onrender.com'
  ])
  const isAllowed = allowedOrigins.has(origin)
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : '')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(204).end()
}

export const verifyFolders = async (user, pass) => {
  // 0: Todo correcto
  // 1: No se pudo crear pictures
  // 2: Usuario o contraseña incorrecta
  // 3: No se pudo crear la carpeta del tester
  try {
    await fs.access('pictures')
  } catch (error) {
    if (error.code === 'ENOENT') await fs.mkdir('pictures')
    else {
      return { ok: false, errorCode: 1, message: error }
    }
  }
  const query = 'SELECT * FROM `tester` WHERE `username` = ? AND `password` = ?'
  const [rows] = await pool.execute(query, [user, pass])
  const message = { ok: false, errorCode: 2, message: 'Usuario o contraseña incorrecta' }
  if (rows.length === 0) {
    return message
  } else {
    try {
      await fs.access('pictures/' + rows[0].table)
      return { ok: true, errorCode: 0, table: rows[0].table }
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir('pictures/' + rows[0].table)
        return { ok: true, errorCode: 0, table: rows[0].table }
      } else {
        return { ok: false, errorCode: 3, message: error }
      }
    }
  }
}
