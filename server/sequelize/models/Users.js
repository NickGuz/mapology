module.exports = (sequelize, DataTypes) => {
  return sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    joinDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    profileImagePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    bannerPath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  });
};
