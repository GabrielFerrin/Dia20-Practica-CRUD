import pool from '../db/db.js'

// ROLES
export const createRoleTable = async (tableName, errorList) => {
  try {
    const sql = 'CREATE TABLE IF NOT EXISTS `role' + tableName + '` (' +
      '`role_id` INT NOT NULL AUTO_INCREMENT, ' +
      '`name` VARCHAR(255) NOT NULL, ' +
      '`description` VARCHAR(255), ' +
      '`is_deleted` TINYINT NOT NULL DEFAULT 0, ' +
      '`date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
      '`date_updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON ' +
      'UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (`role_id`) ' +
      ');'
    await pool.execute(sql)
  } catch (error) {
    errorList.push(error)
  }
}

// COUNTRIES
export const createCountryTable = async (tableName, errorList) => {
  try {
    const query = 'CREATE TABLE IF NOT EXISTS `country' + tableName + '` (' +
      '`country_id` INT NOT NULL AUTO_INCREMENT, ' +
      '`name` VARCHAR(255) NOT NULL, ' +
      '`is_deleted` TINYINT NOT NULL DEFAULT 0, ' +
      '`date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
      '`date_updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON ' +
      'UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (`country_id`)' +
      ');'
    await pool.execute(query)
  } catch (error) {
    errorList.push(error)
  }
}

// USERS
const createUserTable = async (tableName, errorList) => {
  try {
    const sql = 'CREATE TABLE IF NOT EXISTS `user' + tableName + '` (' +
      '`user_id` INT NOT NULL AUTO_INCREMENT ,' +
      '`name` VARCHAR(255) NOT NULL, ' +
      '`email` VARCHAR(255) NOT NULL UNIQUE, ' +
      '`password` VARCHAR(255) NOT NULL, ' +
      '`country_id` INT NOT NULL, ' +
      '`role_id` VARCHAR(255) NOT NULL, ' +
      '`bio` VARCHAR(255), ' +
      '`picture` VARCHAR(255), ' +
      '`is_deleted` TINYINT NOT NULL DEFAULT 0, ' +
      '`date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
      '`date_updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON ' +
      'UPDATE CURRENT_TIMESTAMP,' +
      'FOREIGN KEY (`country_id`) REFERENCES `country' + tableName + '` ' +
      '(`country_id`) ON UPDATE CASCADE ON DELETE RESTRICT,' +
      'PRIMARY KEY (`user_id`)' +
      ');'
    await pool.execute(sql)
  } catch (error) {
    errorList.push(error)
  }
}

// POSTS
export const createPostTable = async (tableName, errorList) => {
  try {
    const sql = 'CREATE TABLE IF NOT EXISTS `post' + tableName + '` (' +
      '`post_id` INT NOT NULL AUTO_INCREMENT, ' +
      '`title` VARCHAR(255) NOT NULL, ' +
      '`content` VARCHAR(255) NOT NULL, ' +
      '`user_id` INT NOT NULL, ' +
      '`is_deleted` TINYINT NOT NULL DEFAULT 0, ' +
      '`date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
      '`date_updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON' +
      ' UPDATE CURRENT_TIMESTAMP, ' +
      'FOREIGN KEY (`user_id`) REFERENCES `user' + tableName + '` ' +
      '(`user_id`) ON UPDATE CASCADE ON DELETE RESTRICT, ' +
      'PRIMARY KEY (`post_id`)' +
      ');'
    await pool.execute(sql)
  } catch (error) {
    errorList.push(error)
  }
}

// COMMENTS
export const createCommentTable = async (tableName, errorList) => {
  try {
    const sql = 'CREATE TABLE IF NOT EXISTS `comment' + tableName + '` (' +
      '`comment_id` INT NOT NULL AUTO_INCREMENT, ' +
      '`content` VARCHAR(255) NOT NULL, ' +
      '`user_id` INT NOT NULL, ' +
      '`post_id` INT NOT NULL, ' +
      '`is_deleted` TINYINT NOT NULL DEFAULT 0,' +
      '`date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
      '`date_updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON' +
      ' UPDATE CURRENT_TIMESTAMP, ' +
      'FOREIGN KEY (`user_id`) REFERENCES `user' + tableName + '` ' +
      '(`user_id`) ON UPDATE CASCADE ON DELETE RESTRICT, ' +
      'FOREIGN KEY (`post_id`) REFERENCES `post' + tableName + '` ' +
      '(`post_id`) ON UPDATE CASCADE ON DELETE RESTRICT, ' +
      'PRIMARY KEY (`comment_id`)' +
      ');'
    await pool.execute(sql)
  } catch (error) {
    errorList.push(error)
  }
}

// CATEGORY
export const createCategoryTable = async (tableName, errorList) => {
  try {
    const sql = 'CREATE TABLE IF NOT EXISTS `category' + tableName + '` (' +
      '`category_id` INT NOT NULL AUTO_INCREMENT, ' +
      '`name` VARCHAR(255) NOT NULL, ' +
      'PRIMARY KEY (`category_id`)' +
      ');'
    await pool.execute(sql)
  } catch (error) {
    errorList.push(error)
  }
}

// POST CATEGORY
export const createPostCategoryTable = async (tableName, errorList) => {
  try {
    const sql = 'CREATE TABLE IF NOT EXISTS `post_category' + tableName + '` (' +
      '`post_id` INT NOT NULL, ' +
      '`category_id` INT NOT NULL, ' +
      'FOREIGN KEY (`post_id`) REFERENCES `post' + tableName + '` (`post_id`),' +
      'FOREIGN KEY (`category_id`) REFERENCES `category' + tableName + '` (`category_id`) ON UPDATE CASCADE ON DELETE RESTRICT' +
      ');'
    await pool.execute(sql)
  } catch (error) {
    errorList.push(error)
  }
}

const getTableName = async (user, pass, errorList) => {
  try {
    const query = 'SELECT * FROM `tester` WHERE `username` = ? AND `password` = ?'
    const [rows] = await pool.execute(query, [user, pass])
    if (rows.length === 0) {
      errorList.push('Credenciales incorrectas')
    }
    return rows[0].table
  } catch (error) {
    errorList.push(error)
  }
}

export const createUserTables = async (req, res) => {
  const { user, pass } = req.query
  if (!user || !pass) {
    const message = 'Credenciales incompletas'
    return res.send({ success: false, message })
  }
  // verify credentials
  const errorList = []
  const tableName = await getTableName(user, pass, errorList)
  try {
    await createRoleTable(tableName, errorList)
    await createCountryTable(tableName, errorList)
    await createUserTable(tableName, errorList)
    await createPostTable(tableName, errorList)
    await createCommentTable(tableName, errorList)
    await createCategoryTable(tableName, errorList)
    await createPostCategoryTable(tableName, errorList)
    if (errorList.length) {
      return res.send({ success: false, errorList })
    }
    return res.send({ success: true })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

// ELIMINATE TABLES
const dropUserTable = async (tableName, errorList) => {
  try {
    const sql = 'DROP TABLE IF EXISTS `user' + tableName + '`;'
    await pool.execute(sql)
  } catch (error) {
    errorList.push(error)
  }
}

const dropCountryTable = async (tableName, errorList) => {
  try {
    const sql = 'DROP TABLE IF EXISTS `country' + tableName + '`;'
    await pool.execute(sql)
  } catch (error) {
    errorList.push(error)
  }
}

const dropRoleTable = async (tableName, errorList) => {
  try {
    const sql = 'DROP TABLE IF EXISTS `role' + tableName + '`;'
    await pool.execute(sql)
  } catch (error) {
    errorList.push(error)
  }
}

const dropPostTable = async (tableName, errorList) => {
  try {
    const sql = 'DROP TABLE IF EXISTS `post' + tableName + '`;'
    await pool.execute(sql)
  } catch (error) {
    errorList.push(error)
  }
}

const dropCommentTable = async (tableName, errorList) => {
  try {
    const sql = 'DROP TABLE IF EXISTS `comment' + tableName + '`;'
    await pool.execute(sql)
  } catch (error) {
    errorList.push(error)
  }
}

const dropCategoryTable = async (tableName, errorList) => {
  try {
    const sql = 'DROP TABLE IF EXISTS `category' + tableName + '`;'
    await pool.execute(sql)
  } catch (error) {
    errorList.push(error)
  }
}

const dropPostCategoryTable = async (tableName, errorList) => {
  try {
    const sql = 'DROP TABLE IF EXISTS `post_category' + tableName + '`;'
    await pool.execute(sql)
  } catch (error) {
    errorList.push(error)
  }
}

export const dropUserTables = async (req, res) => {
  const { table } = req.body
  if (!table) {
    return res.send({ ok: false, message: 'No se recibió la tabla' })
  }
  const errorList = []
  try {
    await dropCountryTable(table, errorList)
    await dropUserTable(table, errorList)
    await dropRoleTable(table, errorList)
    await dropPostTable(table, errorList)
    await dropCommentTable(table, errorList)
    await dropCategoryTable(table, errorList)
    await dropPostCategoryTable(table, errorList)
    if (errorList.length) {
      return res.send({ success: false, errorList })
    }
    return res.send({ success: true })
  } catch (error) {
    res.status(500).send({ success: false, errorList, error })
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

// SEED
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
