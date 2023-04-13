module.exports = (sequelize, DataTypes) => {
    return sequelize.define('likes', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        mapId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
}