module.exports = (sequelize, DataTypes) => {
    return sequelize.define('graphic_text_boxes', {
        mapId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        props: {
            // type: DataTypes.JSON,
            type: DataTypes.TEXT,
            get: function() {
                return JSON.parse(this.getDataValue('props'));
            },
            set: function(value) {
                return this.setDataValue('props', JSON.stringify(value));
            },
            allowNull: false
        }
    });
}