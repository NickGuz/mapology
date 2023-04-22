const SequelizeManager = require("../sequelize/managers/SequelizeManager");
const fs = require("graceful-fs");
const os = require("os");
const { convert } = require("geojson2shp");

exports.createMap = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      errorMessage: "Improperly formatted request",
    });
  }

  const mapInfo = await SequelizeManager.createMap(
    req.body.duplicatedId,
    req.body.authorId,
    req.body.title,
    req.body.description,
    req.body.tags,
    req.body.json
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

exports.deleteMap = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      errorMessage: "Improperly formatted request",
    });
  }

  await SequelizeManager.deleteMap(req.params.id);

  return res.status(200);
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
  const map = await SequelizeManager.updateMapTitle(req.params.id, req.body.title);
  return res.status(200).json({
    data: map,
  });
};

exports.updateMapDescription = async (req, res) => {
  const map = await SequelizeManager.updateMapDescription(req.params.id, req.body.description);
  return res.status(200).json({
    data: map,
  });
};

exports.updateFeatureProperties = async (req, res) => {
  const feature = await SequelizeManager.updateFeatureProperties(req.params.id, req.body.data);
  return res.status(200).json({
    data: feature,
  });
};

exports.updateFeatureGeometry = async (req, res) => {
  console.log("UPDATING");
  const feature = await SequelizeManager.updateFeatureGeometry(req.params.id, req.body.data);
  return res.status(200).json({
    data: feature,
  });
};

exports.insertFeature = async (req, res) => {
  const feature = await SequelizeManager.insertFeature(req.body.mapId, req.body.data);
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
