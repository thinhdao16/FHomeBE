"use strict";

var express = require("express");

var router = express.Router(); // const uploadImage = require("../middlewares/uploadImage");

var roomController = require("../controllers/roomController");

var authenticate = require("../middlewares/authenticate");

var uploadImage = require("../middlewares/uploadImage");

router.post('/rooms', uploadImage, roomController.createRoom); // Lấy thông tin post

router.get('/getRooms', roomController.getAllRooms);
module.exports = router;