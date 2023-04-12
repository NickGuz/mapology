const {
    MapInfo,
    Features,
    Tags
} = require('../sequelize');

exports.createMap = async (duplicatedId, authorId, title, description, tags, json) => {
    // Might need to parse json from string first - JSON.parse(json)
    // let mapJson = JSON.parse(json);

    // Load in map info
    const mapInfo = await MapInfo.create({
        duplicatedId: duplicatedId,
        type: json.type,
        title: title,
        authorId: authorId,
        description: description
    });

    // Load in map features
    let features = json.features;
    for (let feature of features) {
         await Features.create({
             mapId: mapInfo.id,
             type: feature.type,
             properties: feature.properties,
             geometry: feature.geometry
         });
    }

    // Load in map tags
    for (let tag of tags) {
        await Tags.create({
            mapId: mapInfo.id,
            tagName: tag
        });
    }

    return mapInfo;
}