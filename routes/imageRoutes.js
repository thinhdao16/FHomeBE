const express = require("express");
const imageController = require("../controllers/imageController");
const uploadImage = require("../middlewares/uploadImage");
const router = express.Router();

router.post("/postImg", uploadImage, imageController.createImages)

router.get("/getImg", imageController.getAllImages)
module.exports = router
