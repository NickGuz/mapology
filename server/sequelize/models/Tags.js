module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tags', {
        mapId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tagName: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    });
}