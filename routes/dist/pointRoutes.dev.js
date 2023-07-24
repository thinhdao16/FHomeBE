"use strict";

var pointController = require("../controllers/pointController");

var authenticate = require("../middlewares/authenticate");

var uploadImage = require("../middlewares/uploadImage");

var express = require('express');

var router = express.Router();
router.get("/getformpoint", authenticate, pointController.getPoitn);
router.post("/postformpoint", authenticate, uploadImage, pointController.createPointUser);
router.put("/rejectedpoint/:id", authenticate, pointController.rejectedPoint);
router["delete"]("/deleteformpoint/:id", authenticate, pointController.deleteFormPoint);
module.exports = router;