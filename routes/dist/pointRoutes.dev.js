"use strict";

var pointController = require("../controllers/pointController");

var authenticate = require("../middlewares/authenticate");

var express = require('express');

var router = express.Router();
router.get("/getformpoint", authenticate, pointController.getPoitn);
router.post("/postformpoint", authenticate, pointController.createPointUser);
module.exports = router;