import pool from '../db/db.js'

export const createUserTable = async (req, res) => {
  const { table } = req.body
  if (!table) {
    return res.send({ ok: false, message: 'No se recibió la tabla' })
  }
  try {
    const sql = 'CREATE TABLE IF NOT EXISTS `user' + table + '` (' +
      '`user_id` INT NOT NULL AUTO_INCREMENT,' +
      '`name` VARCHAR(255) NOT NULL UNIQUE,' +
      '`email` VARCHAR(255) NOT NULL UNIQUE,' +
      '`role` VARCHAR(255) NOT NULL,' +
      '`picture` TEXT,' +
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
    "('John Doe', 'john.doe@example.com', 'Maestro', 'https://example.com/john.jpg')," +
    "('Jane Smith', 'jane.smith@example.com', 'Controller', 'https://example.com/jane.jpg')," +
    "('Bob Johnson', 'bob.johnson@example.com', 'Controller', 'https://example.com/bob.jpg')," +
    "('Alice Brown', 'alice.brown@example.com', 'Maestro', 'https://example.com/alice.jpg')," +
    "('David Wilson', 'david.wilson@example.com', 'Supervisor', 'https://example.com/david.jpg')," +
    "('Emily Davis', 'emily.davis@example.com', 'Controller', 'https://example.com/emily.jpg')," +
    "('Mike Thompson', 'mike.thompson@example.com', 'Maestro', 'https://example.com/mike.jpg')," +
    "('Sarah Garcia', 'sarah.garcia@example.com', 'Supervisor', 'https://example.com/sarah.jpg')," +
    "('Michael Smith', 'michael.smith@example.com', 'Maestro', 'https://example.com/michael.jpg')," +
    "('Emma Johnson', 'emma.johnson@example.com', 'Controller', 'https://example.com/emma.jpg')"
    const [rows] = await pool.execute(sql, [req.body])
    res.json({ success: true, rows })
  } catch (error) {
    res.status(500).send(error)
  }
}
