import pool from '../db/db.js'
import path from 'path'
import { checkStorageLocal } from './helpers.js'

export const getUsers = async (req, res) => {
  const { user, pass } = req.query
  if (!pass || !user) {
    const message = 'No se recibieron los datos de usuario'
    return res.send({ success: false, message })
  }
  try {
    // obtener nombre de la table del tester
    let sql = 'SELECT * FROM `tester` WHERE `username` = ? AND `password` = ?'
    const [tableRes] = await pool.execute(sql, [user, pass])
    if (tableRes.length === 0) {
      return res.status(404).json({ message: 'Usuario o contraseña incorrecta' })
    }
    // obtener datos de los usuarios
    sql = 'SELECT * FROM `user' + tableRes[0].table + '`;'
    const [rows] = await pool.execute(sql)
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getUserById = async (req, res) => {
  try {
    const sql = 'SELECT * FROM `user` WHERE `id` = ?'
    const [rows] = await pool.execute(sql, [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no existe' })
    }
    res.send(rows[0])
  } catch (error) {
    res.status(500).send(error)
  }
}

// validate email (server side)
const checkEmailAvailableLocal = async (user, pass, email) => {
  const query = 'SELECT * FROM `tester` WHERE `username` = ? AND `password` = ?'
  const [tableRes] = await pool.execute(query, [user, pass])
  if (tableRes.length === 0) {
    const message = 'Usuario o contraseña incorrecta'
    return { success: false, message }
  }
  const sql = 'SELECT * FROM `user' + tableRes[0].table + '` WHERE `email` = ?'
  const [res] = await pool.execute(sql, [email])
  if (res.length > 0) {
    const message = 'El email ya se encuentra registrado'
    return { success: false, message }
  } else {
    return { success: true, table: tableRes[0].table }
  }
}

// validate user
const validateUser = async (user, pass, body, errorList) => {
  // body
  if (!body.name) errorList.push('Falta el nombre')
  if (!body.email) errorList.push('Falta el email')
  if (!body.password) errorList.push('Falta la contraseña')
  if (body.password?.length < 8) errorList.push('La contraseña debe tener al menos 8 caracteres')
  if (!body.role) errorList.push('Falta el rol')
  // email available
  const res = await checkEmailAvailableLocal(user, pass, body.email)
  if (!res.success) errorList.push(res)
  return res.table || null
}

export const createUser = async (req, res) => {
  try {
    const errorList = []
    // check storage
    await checkStorageLocal(errorList)
    // validate query
    const { user, pass } = req.query
    const message = 'No se recibieron los datos del tester'
    if (!pass || !user) {
      return res.send({ success: false, message })
    }
    // validate body
    const table = await validateUser(user, pass, req.body, errorList)
    if (errorList.length) {
      return res.status(400).send({ success: false, message: errorList })
    }
    // add user
    const sql = 'INSERT INTO `user' + table + '` SET ?'
    const [rows] = await pool.query(sql, [req.body])
    res.json({ success: true, rows })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const updateUser = async (req, res) => {
  const { user, pass, id } = req.query
  if (!pass || !user || !id) {
    const message = 'Faltan datos'
    return res.send({ success: false, message })
  }
  try {
    // obtener nombre de la table del tester
    let query = 'SELECT * FROM `tester` WHERE `username` = ? AND `password` = ?'
    const [tableRes] = await pool.execute(query, [user, pass])
    if (tableRes.length === 0) {
      const message = 'Usuario o contraseña incorrecta'
      return res.status(404).json({ success: false, message })
    }
    console.log('The body is: ', req.body)
    const queryParams = Object.keys(req.body).map(key => `${key} = ?`).join(', ')
    const values = [...Object.values(req.body), id]
    query = `UPDATE user${tableRes[0].table} SET ${queryParams} WHERE user_id = ?`
    const [rows] = await pool.query(query, values)
    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no existe' })
    }
    res.send({ success: true, message: 'Usuario actualizado' })
  } catch (error) {
    res.status(500).send(error)
  }
}

export const deleteUser = async (req, res) => {
  const { user, pass, id } = req.query
  if (!pass || !user || !id) {
    const message = 'Faltan datos'
    return res.send({ success: false, message })
  }
  try {
    // obtener nombre de la table del tester
    let sql = 'SELECT * FROM `tester` WHERE `username` = ? AND `password` = ?'
    const [tableRes] = await pool.execute(sql, [user, pass])
    if (tableRes.length === 0) {
      const message = 'Usuario o contraseña incorrecta'
      return res.status(404).json({ success: false, message })
    }
    sql = 'DELETE FROM `user' + tableRes[0].table + '` WHERE `user_id` = ?'
    const [rows] = await pool.execute(sql, [id])
    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no existe' })
    }
    res.send({ success: true, message: 'Usuario eliminado' })
  } catch (error) {
    res.status(500).send(error)
  }
}

// validate email (client side)
export const checkEmailAvailable = async (req, res) => {
  const { user, pass, email } = req.query
  if (!pass || !user || !email) {
    const message = 'Faltan datos'
    return res.send({ success: false, message })
  }
  try {
    const query = 'SELECT * FROM `tester` WHERE `username` = ? AND `password` = ?'
    const [response] = await pool.execute(query, [user, pass])
    if (response.length === 0) {
      const message = 'Usuario o contraseña incorrecta'
      return res.status(404).json({ success: false, message })
    }
    const sql = 'SELECT * FROM `user' + response[0].table + '` WHERE `email` = ?'
    const [rows] = await pool.execute(sql, [email])
    if (rows.length > 0) {
      const message = 'El email ya se encuentra registrado'
      return res.status(400).json({ success: false, message })
    }
    return res.send({ success: true })
  } catch (error) {
    return res.status(500).send(error)
  }
}

export const getPicture = async (req, res) => {
  const { user, pass, id } = req.query
  if (!pass || !user || !id) {
    const message = 'Faltan datos'
    return res.send({ success: false, message })
  }
  try {
    const query = 'SELECT * FROM `tester` WHERE `username` = ? AND `password` = ?'
    const [tableRes] = await pool.execute(query, [user, pass])
    if (tableRes.length === 0) {
      const message = 'Usuario o contraseña incorrecta'
      return res.status(404).json({ success: false, message })
    }
    const sql = 'SELECT `picture` FROM `user' + tableRes[0].table + '` WHERE `user_id` = ?'
    const [filenameRes] = await pool.execute(sql, [id])
    if (filenameRes.length === 0) {
      return res.status(404).json({ message: 'Usuario no existe' })
    }
    const filePath = path.resolve(`./pictures/${tableRes[0].table}/${filenameRes[0].picture}`)
    console.log('PATH: ', filePath)
    res.sendFile(filePath)
  } catch (error) {
    return res.status(500).send(error)
  }
}
