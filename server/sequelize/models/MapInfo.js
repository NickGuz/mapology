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
            allowNull: true,
        },

        isFeatured: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        published: {
            type : DataTypes.BOOLEAN, 
            allowNull: false,
            defaultValue: false
        },
      
        textProps: {
            // type: DataTypes.JSON,
            type: DataTypes.TEXT,
            get: function() {
                let data = this.getDataValue('textProps');
                if (data) {
                    return JSON.parse(data);
                }

                return null;
            },
            set: function(value) {
                return this.setDataValue('textProps', JSON.stringify(value));
            },
            allowNull: true
        }

    });
}