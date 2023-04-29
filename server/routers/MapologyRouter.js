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

// Kinda band-aid fix for empty tags
router.get("/search/map/:term//:sort", GlobalStoreController.searchMaps);
router.get("/search/map/:term/:tags/:sort", GlobalStoreController.searchMaps);

router.get("/tags", GlobalStoreController.getAllTags);

module.exports = router;
