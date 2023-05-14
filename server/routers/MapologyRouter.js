const express = require("express");
const router = express.Router();
const GlobalStoreController = require("../controllers/GlobalStoreController");

// Handles create a new map in the database request
router.post("/map", GlobalStoreController.createMap);

router.post("/duplicate", GlobalStoreController.duplicateMap);

router.delete("/map/:id", GlobalStoreController.deleteMap);

router.get("/maps", GlobalStoreController.getAllMaps);

router.get("/maps/user/:id", GlobalStoreController.getAllMapsByUserId);

router.get("/map/:id", GlobalStoreController.getMapById);

router.get("/tags/:id", GlobalStoreController.getTagsByMapId);

router.put("/map/title/:id", GlobalStoreController.updateMapTitle);

router.put("/map/desc/:id", GlobalStoreController.updateMapDescription);

router.put("/feature/props/:id", GlobalStoreController.updateFeatureProperties);

router.put("/feature/geo/:id", GlobalStoreController.updateFeatureGeometry);

router.post("/feature", GlobalStoreController.insertFeature);

router.delete("/feature/:id", GlobalStoreController.deleteFeature);

router.get("/downloadgeo/:id", GlobalStoreController.downloadMapAsGeoJSON);

router.get("/downloadshp/:id", GlobalStoreController.downloadMapAsShapefile);

router.post("/legend", GlobalStoreController.upsertLegend);
router.get("/legend/:id", GlobalStoreController.getAllLegendsByMapId);

// Kinda band-aid fix for empty tags and empty term
router.get("/search/map/:term//:sort", GlobalStoreController.searchMaps);
router.get("/search/map///:sort", GlobalStoreController.searchMaps);
router.get("/search/map//:tags/:sort", GlobalStoreController.searchMaps);
router.get("/search/map/:term/:tags/:sort", GlobalStoreController.searchMaps);

router.get("/tags", GlobalStoreController.getAllTags);

// Route used for the transactions
router.put("/feature/all/:mapid", GlobalStoreController.updateAllFeatures);

// Routes for the map thumbnails
router.get("/thumbnail/:id", GlobalStoreController.getThumbnail);
router.post("/thumbnail/:id", GlobalStoreController.insertThumbnail);
// Routes for like and dislikes
router.get("/hasLike/:userId/:mapId", GlobalStoreController.hasLike);
router.post("/addLike", GlobalStoreController.addLike);
router.get("/getAllMapLikes/:mapId", GlobalStoreController.getAllMapLikes);
router.delete("/deleteLike/:userId/:mapId", GlobalStoreController.deleteLike);

router.get("/hasDislike/:userId/:mapId", GlobalStoreController.hasDislike);
router.post("/addDislike", GlobalStoreController.addDislike);
router.get("/getAllMapDislikes/:mapId", GlobalStoreController.getAllMapDislikes);
router.delete("/deleteDislike/:userId/:mapId", GlobalStoreController.deleteDislike);

//handles changing publish
router.post("/publish", GlobalStoreController.changePublish);
router.get("/getPublished/:mapId", GlobalStoreController.getPublished);

//compress
router.post("/compress", GlobalStoreController.compressMap);

//comment
router.post("/addComment", GlobalStoreController.addComment);
router.get("/getComments/:mapId", GlobalStoreController.getComments);
router.delete("/deleteComment/:id", GlobalStoreController.deleteComment);

module.exports = router;
