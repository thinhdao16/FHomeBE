"use strict";

var buildings = require("../controllers/buildingController");

var express = require("express");

var router = express.Router();
router.get('/getBuildings', buildings.getAllBuildings);
module.exports = router;