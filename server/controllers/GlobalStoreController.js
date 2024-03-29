const SequelizeManager = require("../sequelize/managers/SequelizeManager");
const fs = require("graceful-fs");
const os = require("os");
const { convert } = require("geojson2shp");
const topojsonSimplify = require("topojson-simplify");
const topojsonServer = require("topojson-server");
const topojsonClient = require("topojson-client");

exports.createMap = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      errorMessage: "Improperly formatted request",
    });
  }

  // Setting minWeight as undefined should I think just line up the points
  // as mentioned in one of the presentations, not actually lose any data
  const compressedJson = doCompressMap(req.body.json, req.body.compression);

  const mapInfo = await SequelizeManager.createMap(
    req.body.duplicatedId,
    req.body.authorId,
    req.body.title,
    req.body.description,
    req.body.tags,
    compressedJson
  );

  if (!mapInfo) {
    return res.status(500).json({
      errorMessage: "Failed to create map",
    });
  }

  return res.status(201).json({
    data: mapInfo,
  });
};

// Helper function to actually do the compression
const doCompressMap = (geojson, minWeight) => {
  // Convert geojson to topojson
  const topology = topojsonServer.topology({ foo: geojson });

  // Simplify the topojson
  let compressedTopo = topojsonSimplify.presimplify(topology);
  compressedTopo = topojsonSimplify.simplify(compressedTopo, minWeight);

  // Convert topojson to geojson
  const geo = topojsonClient.feature(compressedTopo, "foo");
  return geo;
};

// Route to do the compression in the editor
exports.compressMap = (req, res) => {
  if (!req.body.json) {
    return res.status(400).json({
      errorMessage: "Improperly formatted request",
    });
  }

  const map = doCompressMap(req.body.json, 0.01);
  return res.status(200).json({
    data: map,
  });
};

exports.deleteMap = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      errorMessage: "Improperly formatted request",
    });
  }

  await SequelizeManager.deleteMap(req.params.id);

  return res.status(200);
};

exports.duplicateMap = async (req, res) => {
  const authorId = req.body.userId;
  const dupMapId = req.body.mapId;
  let map = await getMapByIdHelper(dupMapId);
  if (!map) {
    return res.status(500).json({
      errorMessage: "Failed to get map",
    });
  }

  const mapInfo = await SequelizeManager.createMap(
    dupMapId,
    authorId,
    "Copy of " + map.mapInfo.title,
    map.mapInfo.description,
    map.tags.map((tag) => tag.tagName),
    map.json
  );

  if (!mapInfo) {
    return res.status(500).json({
      errorMessage: "Failed to create map",
    });
  }

  return res.status(200).json({
    data: mapInfo,
  });
};

exports.getAllMaps = async (req, res) => {
  const maps = await SequelizeManager.getAllMaps();
  if (maps) {
    return res.status(200).json({
      data: maps,
    });
  }

  return res.status(500).json({
    errorMessage: "No maps",
  });
};

exports.getAllMapsByUserId = async (req, res) => {
  const userId = req.params.id;
  const maps = await SequelizeManager.getAllMapsByUserId(userId);
  if (maps) {
    return res.status(200).json({
      data: maps,
    });
  }

  return res.status(500).json({
    errorMessage: "No maps",
  });
};

exports.getAllPublicMapsByUserId = async (req, res) => {
  const userId = req.params.id;
  const maps = await SequelizeManager.getAllPublicMapsByUserId(userId);
  if (maps) {
    return res.status(200).json({
      data: maps,
    });
  }

  return res.status(500).json({
    errorMessage: "No maps",
  });
};
// Local helper function since we'll need this multiple times
const getMapByIdHelper = async (mapId) => {
  const mapInfo = await SequelizeManager.getMapById(mapId);
  const user = await SequelizeManager.getUserById(mapInfo.authorId);
  if (!mapInfo) {
    return null;
  }

  const features = await SequelizeManager.getFeaturesByMapId(mapId);
  if (!features) {
    return null;
  }

  const tags = await SequelizeManager.getTagsByMapId(mapId);

  let json = {
    type: mapInfo.type,
    features: [],
  };

  for (let feature of features) {
    json.features.push({
      id: feature.id,
      type: feature.type,
      properties: feature.properties,
      geometry: feature.geometry,
    });
  }

  let resJson = {
    mapInfo: mapInfo,
    author: user,
    json: json,
    tags: tags,
  };

  return resJson;
};

exports.getMapById = async (req, res) => {
  const map = await getMapByIdHelper(req.params.id);
  if (!map) {
    return res.status(500).json({
      errorMessage: "Failed to get map",
    });
  }

  return res.status(200).json({
    data: map,
  });
};

exports.getTagsByMapId = async (req, res) => {
  const tags = await SequelizeManager.getTagsByMapId(req.params.id);
  if (!tags) {
    return res.status(500).json({
      errorMessage: "Failed to get tags",
    });
  }

  return res.status(200).json({
    data: tags,
  });
};

exports.updateMapTitle = async (req, res) => {
  const map = await SequelizeManager.updateMapTitle(
    req.params.id,
    req.body.title
  );
  return res.status(200).json({
    data: map,
  });
};

exports.updateMapDescription = async (req, res) => {
  const map = await SequelizeManager.updateMapDescription(
    req.params.id,
    req.body.description
  );
  return res.status(200).json({
    data: map,
  });
};

exports.updateMapProperty = async (req, res) => {
  const mapProp = await SequelizeManager.updateMapProperty(
    req.params.id,
    req.body.data
  );
  return res.status(200).json({
    data: mapProp,
  });
};

exports.updateFeatureProperties = async (req, res) => {
  const feature = await SequelizeManager.updateFeatureProperties(
    req.params.id,
    req.body.data
  );
  return res.status(200).json({
    data: feature,
  });
};

exports.updateFeatureGeometry = async (req, res) => {
  const feature = await SequelizeManager.updateFeatureGeometry(
    req.params.id,
    req.body.data
  );
  return res.status(200).json({
    data: feature,
  });
};

exports.insertFeature = async (req, res) => {
  const feature = await SequelizeManager.insertFeature(
    req.body.mapId,
    req.body.data
  );
  res.status(201).json({
    data: feature,
  });
};

exports.deleteFeature = async (req, res) => {
  const feature = await SequelizeManager.deleteFeature(req.params.id);
  res.status(200).json({
    data: feature,
  });
};

exports.downloadMapAsGeoJSON = async (req, res) => {
  const map = await getMapByIdHelper(req.params.id);
  if (!map) {
    return res.status(500).json({
      errorMessage: "Failed to find map",
    });
  }

  return res.status(200).json(map.json);
};

exports.downloadMapAsShapefile = async (req, res) => {
  const map = await getMapByIdHelper(req.params.id);
  if (!map) {
    return res.status(500).json({
      errorMessage: "Failed to find map",
    });
  }

  // 'layer' is the name of files inside the zip
  const options = {
    layer: map.mapInfo.title.toLowerCase().replace(" ", "_"),
  };

  // Write zipped shapefile to temp dir
  let path = `${os.tmpdir()}/${map.mapInfo.title
    .replace(" ", "_")
    .replace("/", "_")
    .replace("\\", "_")}_shp.zip`;
  let stream = fs.createWriteStream(path);
  await convert(map.json, stream, options);

  // Read temp zipped shapefile and send back to client as file
  // which downloads through the browser
  fs.readFile(path, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        errorMessage: "Failed to read shapefile",
      });
    }

    // Delete the temp file
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
      }
      console.log(`${path} was deleted`);
    });

    return res.status(200).send(data);
  });
};

exports.searchMaps = async (req, res) => {
  const searchTerm = req.params.term;
  const searchTags = req.params.tags ? req.params.tags.split("&") : null;
  const sortType = req.params.sort;

  const maps = await SequelizeManager.searchMaps(
    searchTerm,
    searchTags,
    sortType
  );

  return res.status(200).json(maps);
};

exports.getAllTags = async (req, res) => {
  const tags = await SequelizeManager.getAllTags();
  return res.status(200).json(tags);
};

exports.updateAllFeatures = async (req, res) => {
  const features = req.body.data.features;
  const mapId = req.params.mapid;

  const allFeatures = await SequelizeManager.getFeaturesByMapId(mapId);
  const exists = {};
  allFeatures.forEach((f) => (exists[f.id] = true));

  for (let feature of features) {
    if (exists[feature.id]) {
      await SequelizeManager.updateFeature(
        feature.id,
        feature.properties,
        feature.geometry
      );
    } else {
      // If the feature doesn't exist in the backend currently, insert it
      await SequelizeManager.insertFeature(mapId, feature);
    }
  }

  // Lastly, delete the features that exist in the backend but not the current map data
  const inverseExists = {};
  features.forEach((f) => (inverseExists[f.id] = true));
  for (let feature of allFeatures) {
    if (!inverseExists[feature.id]) {
      await SequelizeManager.deleteFeature(feature.id);
    }
  }

  return res.status(200).json();
};

exports.getThumbnail = async (req, res) => {
  const mapId = req.params.id;
  const thumbnail = await SequelizeManager.getThumbnail(mapId);

  if (!thumbnail) {
    return res.status(204).json({
      errorMessage: "Could not find map thumbnail",
    });
  }

  return res.status(200).send(thumbnail.image);
};

exports.insertThumbnail = async (req, res) => {
  const mapId = req.params.id;
  const blob = req.body.data;

  const thumbnail = await SequelizeManager.insertThumbnail(mapId, blob);

  if (!thumbnail) {
    return res.status(500).json({
      errorMessage: "Failed to insert thumbnail",
    });
  }

  return res.status(201).json(thumbnail);
};

exports.hasLike = async (req, res) => {
  const userId = req.params.userId;
  const mapId = req.params.mapId;
  const like = await SequelizeManager.hasLike(userId, mapId);
  if (!like) {
    return res.status(200).send(false);
  }
  return res.status(200).send(true);
};
exports.getAllMapLikes = async (req, res) => {
  const mapId = req.params.mapId;
  const likes = await SequelizeManager.getAllMapLikes(mapId);
  if (!likes) {
    return res.status(200).send([]);
  }
  return res.status(200).send(likes);
};

exports.addLike = async (req, res) => {
  const userId = req.body.userId;
  const mapId = req.body.mapId;
  const like = await SequelizeManager.addLike(userId, mapId);
  if (!like) {
    return res.status(500).json({
      errorMessage: "Failed to add like",
    });
  }

  return res.status(200).json({
    data: like,
  });
};

exports.deleteLike = async (req, res) => {
  const userId = req.params.userId;
  const mapId = req.params.mapId;
  await SequelizeManager.deleteLike(userId, mapId);

  return res.status(200).json();
};

exports.hasDislike = async (req, res) => {
  const userId = req.params.userId;
  const mapId = req.params.mapId;
  const dislike = await SequelizeManager.hasDislike(userId, mapId);
  if (!dislike) {
    return res.status(200).send(false);
  }
  return res.status(200).send(true);
};
exports.getAllMapDislikes = async (req, res) => {
  const mapId = req.params.mapId;
  const dislikes = await SequelizeManager.getAllMapDislikes(mapId);
  if (!dislikes) {
    return res.status(200).send([]);
  }
  return res.status(200).send(dislikes);
};

exports.addDislike = async (req, res) => {
  const userId = req.body.userId;
  const mapId = req.body.mapId;
  const dislike = await SequelizeManager.addDislike(userId, mapId);
  if (!dislike) {
    return res.status(500).json({
      errorMessage: "Failed to add dislike",
    });
  }

  return res.status(200).json({
    data: dislike,
  });
};
exports.deleteDislike = async (req, res) => {
  const userId = req.params.userId;
  const mapId = req.params.mapId;
  await SequelizeManager.deleteDislike(userId, mapId);

  return res.status(200).json();
};

exports.upsertLegend = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      errorMessage: "Improperly formatted request",
    });
  }

  const legendInfo = await SequelizeManager.upsertLegend(
    req.body.mapId,
    req.body.color,
    req.body.label
  );

  if (!legendInfo) {
    return res.status(500).json({
      errorMessage: "Failed to create legend",
    });
  }

  return res.status(201).json(legendInfo);
};

exports.getAllLegendsByMapId = async (req, res) => {
  const legends = await SequelizeManager.getAllLegendsByMapId(req.params.id);
  if (!legends) {
    return res.status(500).json({
      errorMessage: "Failed to get legends",
    });
  }
  return res.status(200).json({
    data: legends,
  });
};

exports.changePublish = async (req, res) => {
  let mapId = req.body.mapId;
  let published = req.body.published;
  const publishChange = await SequelizeManager.changePublish(mapId, published);
  if (!publishChange) {
    return res.status(500).json({
      errorMessage: "Failed to change publish",
    });
  }
  return res.status(200).json();
};

exports.getPublished = async (req, res) => {
  let mapId = req.params.mapId;
  const published = await SequelizeManager.getPublished(mapId);
  if (!published) {
    return res.status(204).json({
      errorMessage: "published was not found",
    });
  }
  return res.status(200).json(published);
};

exports.addComment = async (req, res) => {
  let mapId = req.body.mapId;
  let userId = req.body.userId;
  let comment = req.body.comment;
  const addedComment = await SequelizeManager.addComment(
    mapId,
    userId,
    comment
  );
  if (!addedComment) {
    return res.status(500).json({
      errorMessage: "comment failed",
    });
  }
  return res.status(200).json(addedComment);
};

exports.getComments = async (req, res) => {
  const gotComments = await SequelizeManager.getComments(req.params.mapId);
  if (!gotComments) {
    return res.status(204).json({
      errorMessage: "comments was not found",
    });
  }
  return res.status(200).json(gotComments);
};

exports.deleteComment = async (req, res) => {
  await SequelizeManager.deleteComment(req.params.id);
  return res.status(200).json();
};
