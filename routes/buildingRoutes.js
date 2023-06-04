const buildings = require("../controllers/buildingController");
const express = require("express");
const router = express.Router();

router.get('/getBuildings', buildings.getAllBuildings)
module.exports = router;