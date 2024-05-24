import pool from '../db/db.js'

export const createTesterTable = async (req, res) => {
  const { pass } = req.body
  if (!pass || pass !== 'password*@123') {
    return res.send({ ok: false, message: 'Contraseña inválida' })
  }
  try {
    const sql = 'CREATE TABLE IF NOT EXISTS `tester` (' +
      '`tester_id` INT NOT NULL AUTO_INCREMENT,' +
      '`username` VARCHAR(255) NOT NULL UNIQUE,' +
      '`password` VARCHAR(255) NOT NULL,' +
      '`picture` VARCHAR(255),' +
      '`comment` TEXT,' +
      '`table` VARCHAR(255),' +
      'PRIMARY KEY (`tester_id`)' +
      ');'
    const [rows] = await pool.execute(sql)
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const dropTesterTable = async (req, res) => {
  try {
    const sql = 'DROP TABLE IF EXISTS tester;'
    const [rows] = await pool.execute(sql)
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const trucateTesterTable = async (req, res) => {
  try {
    const sql = 'TRUNCATE TABLE `tester`;'
    const [rows] = await pool.execute(sql)
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}
