const {
  sequelize,
  MapInfo,
  Features,
  Tags,
  User,
  Likes,
  Dislikes,
  Thumbnails,
  Legends,
} = require("../sequelize");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

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

  console.log("tags", tags);
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
  return await MapInfo.findAll({ order: [["createdAt", "DESC"]] });
};

exports.getAllMapsByUserId = async (userId) => {
  return await MapInfo.findAll({
    where: { authorId: userId },
    order: [["createdAt", "DESC"]],
  });
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

exports.updateFeature = async (featureId, props, geom) => {
  return await Features.update(
    {
      properties: props,
      geometry: geom,
    },
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

exports.searchMaps = async (searchTerm, searchTags, sortType) => {
  let orderBy = null;
  if (sortType === "TOP_RATED") {
    orderBy = [[]];
  } else if (sortType === "RECENTLY_UPDATED") {
    orderBy = [["updatedAt", "DESC"]];
  }

  if (searchTerm === "null") {
    searchTerm = null;
  }

  // If we don't have a search term, but we have tags
  if (!searchTerm && searchTags) {
    const results = await MapInfo.findAll({
      include: [
        {
          model: Tags,
          where: {
            tagName: {
              [Op.in]: searchTags,
            },
          },
        },
        //   Likes,
        //   Dislikes,
        // ],
        // attributes: {
        //   include: [[sequelize.fn("COUNT", sequelize.col("likes.mapId")), "rating"]],
        // },
      ],
    });

    console.log("RESULTS", results);
    return results;
    // If we don't have a search term or tags
  } else if (!searchTerm && (!searchTags || searchTags.length <= 0)) {
    return await MapInfo.findAll({ order: [["createdAt", "DESC"]] });

    // If we have a search term, but not tags
  } else if (!searchTags || searchTags.length <= 0) {
    return await MapInfo.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.substring]: searchTerm,
            },
          },
          {
            description: {
              [Op.substring]: searchTerm,
            },
          },
        ],
      },
    });

    // If we have both a search term and tags
  } else {
    return await MapInfo.findAll({
      include: [
        {
          model: Tags,
          where: {
            tagName: {
              [Op.in]: searchTags,
            },
          },
        },
      ],
      where: {
        [Op.or]: [
          {
            title: {
              [Op.substring]: searchTerm,
            },
          },
          {
            description: {
              [Op.substring]: searchTerm,
            },
          },
        ],
      },
    });
  }
};

exports.getAllTags = async () => {
  return await Tags.findAll();
};

exports.getFeatureById = async (fid) => {
  return await Features.findAll({
    where: {
      id: fid,
    },
  });
};

exports.getThumbnail = async (mapId) => {
  return await Thumbnails.findOne({
    where: {
      mapId: mapId,
    },
  });
};

exports.insertThumbnail = async (mapId, data) => {
  console.log("INSERTING", mapId);
  return await Thumbnails.upsert({
    mapId: mapId,
    image: data,
  });
};

exports.createLegend = async (mapId, color, label) => {
  return await Legends.create({
    mapId: mapId,
    color: color,
    label: label,
  });
};