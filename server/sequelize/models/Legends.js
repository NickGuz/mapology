module.exports = (sequelize, DataTypes) => {
    return sequelize.define('legends', {
        mapId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING(7),
            allowNull: false
        },
        label: {
            type: DataTypes.STRING(40),
            allowNull: false
        }
    });
}