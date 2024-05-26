import fs from 'fs/promises'
import pool from '../db/db.js'
import path from 'path'

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

const getFolderSize = async (folderPath) => {
  const files = await fs.readdir(folderPath)
  let size = 0
  for (const file of files) {
    const filePath = path.join(folderPath, file)
    const stats = await fs.stat(filePath)
    if (stats.isDirectory()) {
      size += await getFolderSize(filePath)
    } else {
      size += stats.size
    }
  }
  return (size / (1024)).toFixed(4)
}

export const checkStorage = async (req, res) => {
  const folderSize = await getFolderSize('./pictures')
  console.log(`The size of the folder is ${folderSize} bytes.`)
  res.send({ folderSize: parseFloat(folderSize) })
}

export const eliminateStorage = async (req, res) => {
  try {
    const filePath = path.resolve('./pictures')
    await fs.access(filePath)
    await fs.rm(filePath, { recursive: true, force: true })
    res.json({ success: true })
  } catch (error) {
    if (error.code === 'ENOENT') res.json({ success: true })
    else res.status(500).json(error)
  }
}
