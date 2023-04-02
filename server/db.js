const mysql = require("mysql");
const dbConfig = require("./db.config");

const connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASS,
  database: dbConfig.DB
});

module.exports = connection;