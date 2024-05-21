import pool from '../db/db.js'

export const getUsers = async (req, res) => {
  try {
    const sql = 'SELECT * FROM `users`'
    const [rows] = await pool.execute(sql)
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getUserById = async (req, res) => {
  try {
    const sql = 'SELECT * FROM `users` WHERE `id` = ?'
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
    const sql = 'INSERT INTO `users` SET ?'
    const [rows] = await pool.query(sql, [req.body])
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const updateUser = async (req, res) => {
  try {
    const sql = 'UPDATE `users` SET ? WHERE `id` = ?'
    const [rows] = await pool
      .query(sql, [req.body, req.params.id])
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const deleteUser = async (req, res) => {
  try {
    const sql = 'DELETE FROM `users` WHERE `id` = ?'
    const [rows] = await pool.execute(sql, [req.params.id])
    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no existe' })
    }
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}
