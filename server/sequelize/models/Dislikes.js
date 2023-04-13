module.exports = (sequelize, DataTypes) => {
    return sequelize.define('dislikes', {
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
