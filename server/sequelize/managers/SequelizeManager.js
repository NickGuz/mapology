const { MapInfo, Features, Tags, User } = require("../sequelize");

exports.createMap = async (
  duplicatedId,
  authorId,
  title,
  description,
  tags,
  json
) => {
  // Might need to parse json from string first - JSON.parse(json)
  // let mapJson = JSON.parse(json);

  // Load in map info
  const mapInfo = await MapInfo.create({
    duplicatedId: duplicatedId,
    type: json.type,
    title: title,
    authorId: authorId,
    description: description,
  });

  // Load in map features
  let features = json.features;
  for (let feature of features) {
    await Features.create({
      mapId: mapInfo.id,
      type: feature.type,
      properties: feature.properties,
      geometry: feature.geometry,
    });
  }

  // Load in map tags
  for (let tag of tags) {
    await Tags.create({
      mapId: mapInfo.id,
      tagName: tag,
    });
  }

  return mapInfo;
};

exports.deleteMap = async (id) => {
  await MapInfo.destroy({
    where: {
      id: id,
    },
  });
};

exports.getAllMaps = async () => {
  return await MapInfo.findAll();
};

exports.getMapById = async (id) => {
  return await MapInfo.findByPk(id);
};

exports.getFeaturesByMapId = async (id) => {
  return await Features.findAll({
    where: {
      mapId: id,
    },
  });
};

exports.getTagsByMapId = async (id) => {
  return await Tags.findAll({
    where: {
      mapId: id,
    },
  });
};

exports.getUserById = async (id) => {
  return await User.findByPk(id);
};

exports.updateMapTitle = async (mapId, title) => {
  return await MapInfo.update(
    { title: title },
    {
      where: {
        id: mapId,
      },
    }
  );
};

exports.updateMapDescription = async (mapId, desc) => {
  return await MapInfo.update(
    { description: desc },
    {
      where: {
        id: mapId,
      },
    }
  );
};

exports.updateFeatureProperties = async (featureId, data) => {
  return await Features.update(
    { properties: data },
    {
      where: {
        id: featureId,
      },
    }
  );
};

exports.updateFeatureGeometry = async (featureId, data) => {
  return await Features.update(
    { geometry: data },
    {
      where: {
        id: featureId,
      },
    }
  );
};

exports.insertFeature = async (mapId, data) => {
  // This is assuming 'data' is json, but might need to parse
  return await Features.create({
    mapId: mapId,
    type: data.type,
    properties: data.properties,
    geometry: data.geometry,
  });
};

exports.deleteFeature = async (featureId) => {
  return await Features.destroy({
    where: {
      id: featureId,
    },
  });
};
