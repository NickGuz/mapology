const express = require('express');
const router = express.Router();
const GlobalStoreController = require('../controllers/GlobalStoreController');

// Handles create a new map in the database request
router.post('/map', GlobalStoreController.createMap);

router.get('/maps', GlobalStoreController.getAllMaps);

module.exports = router;