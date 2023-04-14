const SequelizeManager = require('../sequelize/managers/SequelizeManager');

exports.createMap = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request'
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
            errorMessage: 'Failed to create map'
        });
    }

    return res.status(201).json({
        data: mapInfo
    });
}

exports.getAllMaps = async (req, res) => {
    const maps = await SequelizeManager.getAllMaps();
    if (maps) {
        return res.status(200).json({
            data: maps
        });
    }

    return res.status(500).json({
        errorMessage: 'No maps'
    });
}

exports.getMapById = async (req, res) => {
    const mapInfo = await SequelizeManager.getMapById(req.params.id);
    const user = await SequelizeManager.getUserById(mapInfo.authorId);
    if (!mapInfo) {
        return res.status(404).json({
            errorMessage: "Map not found"
        });
    }

    const features = await SequelizeManager.getFeaturesByMapId(req.params.id);
    if (!features) {
        return res.status(404).json({
            errorMessage: "Features not found"
        });
    }

    const tags = await SequelizeManager.getTagsByMapId(req.params.id);

    let json = {
        'type': mapInfo.type,
        'features': []
    }

    for (let feature of features) {
        json.features.push({
            'type': feature.type,
            'properties': feature.properties,
            'geometry': feature.geometry
        });
    }

    let resJson = {
        'mapInfo': mapInfo,
        'author': user,
        'json': json,
        'tags': tags,
    }

    return res.status(200).json({
        data: resJson
    });
}
