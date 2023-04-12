module.exports = (sequelize, DataTypes) => {
    return sequelize.define('features', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        mapId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        properties: {
            // type: DataTypes.JSON,
            type: DataTypes.TEXT,
            get: () => {
                return JSON.parse(this.getDataValue('properties'));
            },
            set: (value) => {
                return this.setDataValue('properties', value);
            },
            allowNull: false
        },
        geometry: {
            // type: DataTypes.JSON,
            type: DataTypes.TEXT,
            get: () => {
                return JSON.parse(this.getDataValue('geometry'));
            },
            set: (value) => {
                return this.setDataValue('geometry', value);
            },
            allowNull: false
        }
    });
}