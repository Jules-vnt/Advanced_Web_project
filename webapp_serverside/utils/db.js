// MySQL connection pool, shared by all the repositories.
// Settings come from the .env file (see .env.example).
require('dotenv').config()
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  // DECIMAL columns come back as numbers instead of strings
  decimalNumbers: true,
  // DATE columns come back as 'YYYY-MM-DD' instead of a JS Date (no timezone shift)
  dateStrings: true
})

module.exports = pool
