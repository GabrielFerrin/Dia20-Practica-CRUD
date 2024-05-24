import pool from '../db/db.js'

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
    sql = 'SELECT * FROM `' + tableRes[0].table + '`;'
    const [rows] = await pool.execute(sql)
    res.send(rows)
  } catch (error) {
    console.log('Error thrown', error)
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

export const createUser = async (req, res) => {
  try {
    const sql = 'INSERT INTO `user` SET ?'
    const [rows] = await pool.query(sql, [req.body])
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const updateUser = async (req, res) => {
  try {
    const sql = 'UPDATE `user` SET ? WHERE `id` = ?'
    const [rows] = await pool
      .query(sql, [req.body, req.params.id])
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const deleteUser = async (req, res) => {
  try {
    const sql = 'DELETE FROM `user` WHERE `id` = ?'
    const [rows] = await pool.execute(sql, [req.params.id])
    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no existe' })
    }
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}
