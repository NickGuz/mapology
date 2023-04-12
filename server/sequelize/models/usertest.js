module.exports = (sequelize, DataTypes) => {
   return sequelize.define('post', {
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
    });
}