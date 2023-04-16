const express = require("express");
const router = express.Router();
const GlobalStoreController = require("../controllers/GlobalStoreController");

// Handles create a new map in the database request
router.post("/map", GlobalStoreController.createMap);

router.get("/maps", GlobalStoreController.getAllMaps);

router.get("/map/:id", GlobalStoreController.getMapById);

router.put("/map/title/:id", GlobalStoreController.updateMapTitle);

router.put("/map/desc/:id", GlobalStoreController.updateMapDescription);

router.put("/feature/props/:id", GlobalStoreController.updateFeatureProperties);

router.put("/feature/geo/:id", GlobalStoreController.updateFeatureGeometry);

router.post("/feature", GlobalStoreController.insertFeature);

router.delete("/feature/:id", GlobalStoreController.deleteFeature);

router.get("/downloadgeo/:id", GlobalStoreController.downloadMapAsGeoJSON);

router.get("/downloadshp/:id", GlobalStoreController.downloadMapAsShapefile);

module.exports = router;
