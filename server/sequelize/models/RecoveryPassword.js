module.exports = (sequelize, DataTypes) => {
  return sequelize.define("recovery_password", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
};
