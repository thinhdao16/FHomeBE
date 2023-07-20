"use strict";

var express = require("express");

var imageController = require("../controllers/imageController");

var uploadImage = require("../middlewares/uploadImage");

var router = express.Router();
router.post("/postImg", uploadImage, imageController.createImages);
router.get("/getImg", imageController.getAllImages);
module.exports = router;