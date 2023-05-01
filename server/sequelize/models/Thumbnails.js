module.exports = (sequelize, DataTypes) => {
  return sequelize.define("thumbnails", {
    mapId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    image: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
      // get() {
      //   return this.getdatavalue("image").tostring("base64");
      // },
    },
  });
};
