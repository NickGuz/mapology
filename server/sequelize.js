const Sequelize = require("sequelize");
const UserModel = require("./models/usertest");
const config = require("./config/db.config")

const sequelize = new Sequelize(
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
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

const User = UserModel(sequelize, Sequelize);

sequelize
  .sync()
  .then(() => {
    console.log("Users table created successfully");
  })
  .catch((error) => {
    console.error("Unable to create table: ", error);
  });

module.exports = User;