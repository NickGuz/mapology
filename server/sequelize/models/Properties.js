module.exports = (sequelize, DataTypes) => {
    return sequelize.define('properties', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        featureId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        key: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        value: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    });
}