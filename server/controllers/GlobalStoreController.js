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