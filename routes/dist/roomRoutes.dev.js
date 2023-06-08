"use strict";

var express = require("express");

var router = express.Router(); // const uploadImage = require("../middlewares/uploadImage");

var roomController = require("../controllers/roomController");

var authenticate = require("../middlewares/authenticate");

var authorize = require("../middlewares/authorize");

var uploadImage = require("../middlewares/uploadImage");

var uploadImages = require("../middlewares/uploadImgs");

router.post('/createRoom', authenticate, uploadImage, roomController.createRoom);
router.post('/createRooms', authenticate, uploadImages, roomController.createRoom); // Lấy thông tin post

router.get('/getRooms', roomController.getAllRooms); //get by userId

router.get('/getRoomsByUserId', authenticate, authorize(['landlord']), roomController.getRoomsByUserId); //

router.put('/updateRoom/:id', roomController.updateRoomById);
router["delete"]('/deleteRoom/:id', roomController.deleteRoomById);
module.exports = router;