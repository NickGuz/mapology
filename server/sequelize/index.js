const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: "mysql",
        define: {
            // this stops pluralling from sequelize tables
            freezeTableName: true
        }
    }
);

const modelDefiners = [
    require('./models/usertest.model')
    // Add more models here...
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

// Execute any extra setup after the models are defined, such as adding associations
//applyExtraSetup(sequelize);

// Export the sequelize connection instance to be used around our app
module.exports = sequelize;
