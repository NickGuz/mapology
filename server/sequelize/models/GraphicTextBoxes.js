module.exports = (sequelize, DataTypes) => {
    return sequelize.define('graphic_text_boxes', {
        mapId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        props: {
            // type: DataTypes.JSON,
            type: DataTypes.TEXT,
            get: () => {
                return JSON.parse(this.getDataValue('props'));
            },
            set: (value) => {
                return this.setDataValue('props', value);
            },
            allowNull: false
        }
    });
}