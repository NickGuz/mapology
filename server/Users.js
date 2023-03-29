const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    'DB_NAME',
    'DB_USERNAME',
    'DB_PASSWORD',
    {
        host: 'DB_HOST', //server url or ip address
        dialect: 'mysql'
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const Users = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(320),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    joinDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    profileImagePath: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    bannerPath: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    bio: {
        type: DataTypes.STRING(500),
        allowNull: true
    }
});

sequelize.sync().then(() => {
    console.log('Users table created successfully');
}).catch((error) => {
    console.error('Unable to create table: ', error);
});