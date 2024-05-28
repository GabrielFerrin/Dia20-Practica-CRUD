import fs from 'fs/promises'
import pool from '../db/db.js'
import path from 'path'

export const cors = (req, res, next) => {
  const origin = req.headers.origin || req.headers.host
  console.log('Complete url:', origin + req.originalUrl)
  const allowedOrigins = new Set([
    'http://127.0.0.1:5500',
    'http://127.0.0.1:3000',
    'https://funval-users-fe.onrender.com'
  ])
  // console.log('Complete url:', origin + req.originalUrl)
  const isAllowed = allowedOrigins.has(origin)
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : '')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

export const corsOptions = (req, res) => {
  const origin = req.headers.origin || req.headers.host
  const allowedOrigins = new Set([
    'http://127.0.0.1:5500',
    'http://127.0.0.1:3000',
    'https://funval-users-fe.onrender.com'
  ])
  const isAllowed = allowedOrigins.has(origin)
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : '')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(204).end()
}

export const verifyFolders = async (user = '', pass = '') => {
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
  if (user === '' && pass === '') return 0
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
  try {
    if (!await verifyFolders()) {
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
  } catch (error) {
    const message = 'Error al comprobar espacio disponible en el servidor (file manager)'
    return { message, error }
  }
}

export const checkStorage = async (req, res) => {
  try {
    const folderSize = await getFolderSize('./pictures')
    res.send({ success: true, folderSize: parseFloat(folderSize) })
  } catch (error) {
    if (error.code === 'ENOENT') res.send({ success: true, folderSize: 0 })
    else res.status(500).json(error)
  }
}

export const checkStorageLocal = async (errorList) => {
  let message = 'No queda espacio en el servidor. Esperamos resolverlo pronto.'
  try {
    const folderSize = await getFolderSize('./pictures')
    if (folderSize >= 9500) errorList.push(message)
  } catch (error) {
    message = 'Error al comprobar espacio disponible en el servidor (file manager)'
    errorList(message)
  }
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

export const dropTalbe = async (table) => {
  try {
    const query = 'DROP TABLE IF EXISTS `' + table + '`'
    const [rows] = await pool.execute(query)
    console.log(rows)
    console.log('Se elimino la tabla ' + table)
  } catch (error) {
    console.log(error)
  }
}

export const emptyTable = async (table) => {
  try {
    const query = 'TRUNCATE TABLE `' + table + '`'
    const [rows] = await pool.execute(query)
    console.log(rows)
    console.log('Se vacio la tabla ' + table)
  } catch (error) {
    console.log(error)
  }
}
