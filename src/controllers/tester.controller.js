import pool from '../db/db.js'

export const testerLogin = async (req, res) => {
  const { user, pass } = req.query
  console.log(req.query.user)
  if (!pass || !user) {
    return res.send({ ok: false, message: 'Falalta usuario o contraseña' })
  }
  try {
    const sql = 'SELECT * FROM `tester` WHERE `username` = ? AND `password` = ?'
    const [rows] = await pool.execute(sql, [user, pass])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario o contraseña incorrecta' })
    }
    res.send({ success: true })
  } catch (error) {
    res.status(500).send({ success: false, message: error.message })
  }
}

export const addTester = async (req, res) => {
  const errorList = []
  try {
    validateTesterLocal(req.body, errorList)
    await validateTesterDB(req.body, errorList)
    await checkTestersInDB(errorList)
    if (errorList.length > 0) {
      return res.status(400).send(errorList)
    }
    const sql = 'INSERT INTO `tester` SET ?'
    const [rows] = await pool.query(sql, [req.body])
    res.send({ success: true, message: rows })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const validateTesterLocal = async (tester, errorList) => {
  if (!tester.username) errorList.push('Falta el nombre de usuario')
  if (!tester.password) errorList.push('Falta la contraseña')
  if (!tester.table) errorList.push('Falta el nombre de la table')
  else tester.table = 'user' + tester.table
}

export const validateTesterDB = async (tester, errorList) => {
  try {
    const sql = 'SELECT * FROM `tester` WHERE `username` = ?'
    const [rows] = await pool.execute(sql, [tester.username])
    const message = 'El nombre de usuario no está disponible'
    if (rows.length > 0) errorList.push(message)
  } catch (error) {
    errorList.push(error)
  }
}

export const availableTesterUsername = async (req, res) => {
  console.log(req.params)
  try {
    const sql = 'SELECT * FROM `tester` WHERE `username` = ?'
    const [rows] = await pool.execute(sql, [req.params.username])
    const message = 'El nombre de usuario no está disponible'
    if (rows.length > 0) res.status(400).json({ success: false, message })
    else res.send({ success: true })
  } catch (error) {
    res.status(500).send(error)
  }
}

export const checkAvailableTester = async (req, res) => {
  try {
    const sql = 'SELECT * FROM `tester`'
    const [rows] = await pool.execute(sql)
    res.send({ testers: 10 - rows.length })
  } catch (error) {
    res.status(500).send(error)
  }
}

const checkTestersInDB = async (errorList) => {
  try {
    const sql = 'SELECT * FROM `tester`'
    const [rows] = await pool.execute(sql)
    if (0 - rows.length > 10) errorList.push('Se sobrepasó la cantidad de testers')
  } catch (error) {
    errorList.push(error)
  }
}

export const getTesters = async (req, res) => {
  try {
    const sql = 'SELECT * FROM `tester`'
    const [rows] = await pool.execute(sql)
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}
