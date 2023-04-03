const mysql = require("mysql2");
const dbConfig = require("../config/db.config");

const connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASS,
  database: dbConfig.DB
});

module.exports = connection;