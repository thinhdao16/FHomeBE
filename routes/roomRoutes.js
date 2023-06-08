const express = require("express");
const router = express.Router();
// const uploadImage = require("../middlewares/uploadImage");
const roomController = require("../controllers/roomController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const uploadImage = require("../middlewares/uploadImage");
const uploadImages = require("../middlewares/uploadImgs");


router.post('/createRoom', authenticate, uploadImage, roomController.createRoom);
router.post('/createRooms', authenticate, uploadImages, roomController.createRoom);
// Lấy thông tin post
router.get('/getRooms', roomController.getAllRooms);

//get by userId
router.get('/getRoomsByUserId', authenticate, authorize(['landlord']), roomController.getRoomsByUserId);

//
router.put('/updateRoom/:id',roomController.updateRoomById)

router.delete('/deleteRoom/:id',roomController.deleteRoomById)

module.exports = router;
