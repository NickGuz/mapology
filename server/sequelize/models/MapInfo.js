module.exports = (sequelize, DataTypes) => {
    return sequelize.define('map_info', {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        duplicatedId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        type: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        title: {
            type: DataTypes.STRING(40),
            allowNull: false
        },

        description: {
            type: DataTypes.STRING(500),
            allowNull: true
        },

        publishedDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },

        lastEditedDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },

        imagePath: {
            type: DataTypes.STRING(500),
            allowNull: true
        },

        isFeatured: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },

        textProps: {
            // type: DataTypes.JSON,
            type: DataTypes.TEXT,
            get: () => {
                return JSON.parse(this.getDataValue('textProps'));
            },
            set: (value) => {
                return this.setDataValue('textProps', value);
            },
            allowNull: true
        }

    });
}