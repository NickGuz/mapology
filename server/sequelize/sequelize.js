const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const config = require("../config/db.config");
const SequelizeMock = require("sequelize-mock");
const createAssociations = require("./associations");

// use env var to use mock db here instead if running tests
const sequelize = process.env.TEST
  ? new SequelizeMock()
  : new Sequelize(config.DB, config.USER, config.PASS, {
      host: config.HOST,
      dialect: "mysql",
      define: {
        // this stops pluralling from sequelize tables
        freezeTableName: true,
      },
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

// Import models
const UserTest = require("./models/usertest")(sequelize, DataTypes);
const User = require("./models/Users")(sequelize, DataTypes);
const MapInfo = require("./models/MapInfo")(sequelize, DataTypes);
const Features = require("./models/Features")(sequelize, DataTypes);
const Comments = require("./models/Comments")(sequelize, DataTypes);
const Likes = require("./models/Likes")(sequelize, DataTypes);
const Dislikes = require("./models/Dislikes")(sequelize, DataTypes);
const Tags = require("./models/Tags")(sequelize, DataTypes);
const Legends = require("./models/Legends")(sequelize, DataTypes);
const GraphicTextBoxes = require("./models/GraphicTextBoxes")(
  sequelize,
  DataTypes
);

// Define associations (foreign keys)
createAssociations(sequelize.models);

// Synchronize all models
if (!process.env.TEST) {
  sequelize
    .sync(/*{ force: true }*/)
    .then(() => {
      console.log("SQL tables created successfully");

      // TODO remove
      // create test user for testing map imports
      User.create({
        email: "test@test.com",
        username: "testuser",
        password: "1234",
      });
    })
    .catch((error) => {
      console.error("Unable to create SQL tables: ", error);
    });
}

module.exports = {
  sequelize,
  UserTest,
  User,
  MapInfo,
  Features,
  Comments,
  Likes,
  Dislikes,
  Tags,
  Legends,
  GraphicTextBoxes,
};
