module.exports = (sequelize, DataTypes) => {
    return sequelize.define('geometry', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        featureId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    });
}