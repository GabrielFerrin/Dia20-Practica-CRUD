import pool from '../db/db.js'

// USERS
export const createUserTable = async (req, res) => {
  const { table } = req.body
  if (!table) {
    return res.send({ ok: false, message: 'No se recibió la tabla' })
  }
  try {
    const sql = 'CREATE TABLE IF NOT EXISTS `user' + table + '` (' +
      '`user_id` INT NOT NULL AUTO_INCREMENT,' +
      '`name` VARCHAR(255) NOT NULL,' +
      '`email` VARCHAR(255) NOT NULL UNIQUE,' +
      '`password` VARCHAR(255) NOT NULL,' +
      '`role` VARCHAR(255) NOT NULL,' +
      '`picture` VARCHAR(255),' +
      'PRIMARY KEY (`user_id`)' +
      ');'
    const [rows] = await pool.execute(sql)
    res.json({ success: true, rows })
  } catch (error) {
    res.status(500).send(error)
  }
}

export const dropUserTable = async (req, res) => {
  const { table } = req.body
  if (!table) {
    return res.send({ ok: false, message: 'No se recibió la tabla' })
  }
  try {
    const sql = 'DROP TABLE IF EXISTS `' + table + '`;'
    const [rows] = await pool.execute(sql)
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const trucateUserTable = async (req, res) => {
  try {
    const sql = 'TRUNCATE TABLE `user`;'
    const [rows] = await pool.execute(sql)
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const seedUsers = async (req, res) => {
  const { table } = req.body
  if (!table) {
    return res.send({ ok: false, message: 'No se recibió la tabla' })
  }
  try {
    const sql = 'INSERT IGNORE INTO `user' + table + '` (`name`, `email`, `role`, `picture`)' +
    'VALUES ' +
    "('John Doe', 'john.doe@example.com', 'administrador', 'local')," +
    "('Jane Smith', 'jane.smith@example.com', 'administrador', 'local')," +
    "('Bob Johnson', 'bob.johnson@example.com', 'usuario', 'local')," +
    "('Alice Brown', 'alice.brown@example.com', 'usuario', 'local')," +
    "('David Wilson', 'david.wilson@example.com', 'usuario', 'local')," +
    "('Emily Davis', 'emily.davis@example.com', 'administrador', 'local')," +
    "('Mike Thompson', 'mike.thompson@example.com', 'usuario', 'local')," +
    "('Sarah Garcia', 'sarah.garcia@example.com', 'usuario', 'local')," +
    "('Michael Smith', 'michael.smith@example.com', 'usuario', 'local')," +
    "('Emma Johnson', 'emma.johnson@example.com', 'usuario', 'local')"
    const [rows] = await pool.execute(sql, [req.body])
    res.json({ success: true, rows })
  } catch (error) {
    res.status(500).send(error)
  }
}

// POSTS
export const createPostTable = async (req, res) => {
  const { table } = req.body
  if (!table) {
    return res.send({ ok: false, message: 'No se recibió la tabla' })
  }
  try {
    const sql = 'CREATE TABLE IF NOT EXISTS `post' + table + '` (' +
      '`post_id` INT NOT NULL AUTO_INCREMENT,' +
      '`name` VARCHAR(255) NOT NULL,' +
      '`email` VARCHAR(255) NOT NULL UNIQUE,' +
      '`password` VARCHAR(255) NOT NULL,' +
      '`role` VARCHAR(255) NOT NULL,' +
      '`picture` VARCHAR(255),' +
      'PRIMARY KEY (`user_id`)' +
      ');'
    const [rows] = await pool.execute(sql)
    res.json({ success: true, rows })
  } catch (error) {
    res.status(500).send(error)
  }
}
