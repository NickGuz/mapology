const Sequelize = require("sequelize");
const UserModel = require("./models/usertest");
const config = require("../config/db.config")
const SequelizeMock = require('sequelize-mock');

// use env var to use mock db here instead if running tests
const sequelize = process.env.TEST ? new SequelizeMock()
  : new Sequelize(
  config.DB, 
  config.USER, 
  config.PASS, {
    host: config.HOST,
    dialect: "mysql",
    define: {
      // this stops pluralling from sequelize tables
      freezeTableName: true
    }
  }); 

// confirms the connection
if (!process.env.TEST) {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
    });
}

const User = UserModel(sequelize, Sequelize);

if (!process.env.TEST) {
  sequelize
    .sync()
    .then(() => {
      console.log("SQL tables created successfully");
    })
    .catch((error) => {
      console.error("Unable to create SQL tables: ", error);
    });
}

module.exports = { sequelize, User};