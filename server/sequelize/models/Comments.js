module.exports = (sequelize, DataTypes) => {
    return sequelize.define('comments', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        mapId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        text: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        dateTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
}