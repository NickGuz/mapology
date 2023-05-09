const createAssociations = (models) => {
  // Define associations (foreign keys)
  models.map_info.hasMany(models.features, { foreignKey: "mapId" });
  models.features.belongsTo(models.map_info);

  models.map_info.hasMany(models.comments, { foreignKey: "mapId" });
  models.comments.belongsTo(models.map_info);

  models.map_info.hasMany(models.graphic_text_boxes, { foreignKey: "mapId" });
  models.graphic_text_boxes.belongsTo(models.map_info);

  models.map_info.hasMany(models.tags, { foreignKey: "mapId" });
  models.tags.belongsTo(models.map_info);

  models.map_info.hasMany(models.likes, { foreignKey: "mapId" });
  models.likes.belongsTo(models.map_info);

  models.map_info.hasMany(models.dislikes, { foreignKey: "mapId" });
  models.dislikes.belongsTo(models.map_info);

  models.map_info.hasMany(models.legends, { foreignKey: "mapId" });
  models.legends.belongsTo(models.map_info);

  models.users.hasMany(models.map_info, { foreignKey: "authorId" });
  models.map_info.belongsTo(models.users, { foreignKey: "authorId" });

  models.users.hasMany(models.comments);
  models.comments.belongsTo(models.users);

  models.users.hasMany(models.likes);
  models.likes.belongsTo(models.users);

  models.users.hasMany(models.dislikes);
  models.dislikes.belongsTo(models.users);

  models.map_info.hasOne(models.thumbnails, { foreignKey: "mapId" });
  models.thumbnails.belongsTo(models.map_info);
};

module.exports = createAssociations;
