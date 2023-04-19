module.exports = (sequelize, DataTypes) => {
  return sequelize.define("features", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mapId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    properties: {
      // type: DataTypes.JSON,
      type: DataTypes.TEXT,
      get: function () {
        return JSON.parse(this.getDataValue("properties"));
      },
      set: function (value) {
        return this.setDataValue("properties", JSON.stringify(value));
      },
      allowNull: false,
    },
    geometry: {
      // type: DataTypes.JSON,
      type: DataTypes.TEXT("medium"),
      get: function () {
        if (!this.getDataValue("geometry")) {
          return;
        }
        return JSON.parse(this.getDataValue("geometry"));
      },
      set: function (value) {
        return this.setDataValue("geometry", JSON.stringify(value));
      },
      allowNull: false,
    },
  });
};
