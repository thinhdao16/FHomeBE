const Rooms = require("../models/room");
const { validationResult } = require("express-validator");

const createRoom = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "Fail",
        message: errors.array(),
      });
    }

    const newRoom = new Rooms({
      ...req.body,
      users: req.user.id,
      img: req.body.img // Lấy đường dẫn từ trường img của req.body
    });


    await newRoom.save();
    res.status(201).json({
      status: "Success",
      message: "Room created successfully!",
      data: {
         newRoom
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Rooms.find({status:true});
    res.status(200).json({
      status: "Success",
      messages: "Get rooms successfully!",
      data: { rooms },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

const getRoomsByUserId = async (req, res) => {
  try {
    const rooms = await Rooms.find({ users: req.user.id });
    res.status(200).json({
      status: "Success",
      messages: "Get rooms successfully!",
      data: { rooms },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

const updateRoomById = async (req, res) => {
  try {
    const updatedRoom = await Rooms.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "Success",
      messages: "Update room successfully!",
      data: { room: updatedRoom },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

const deleteRoomById = async (req, res) => {
  try {
    const roomId = req.params.id;
    const updatedRoom = await Rooms.findByIdAndUpdate(
      roomId,
      { status: false },
      { new: true }
    );
    if (!updatedRoom) {
      return res.status(404).json({
        status: "Fail",
        message: `Room with id ${roomId} is not found`,
      });
    }
    res.status(200).json({
      status: "Success",
      message: `Room with id ${roomId} has been deleted successfully`,
      data: { room: updatedRoom },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
};
module.exports = {
  createRoom,
  getAllRooms,
  getRoomsByUserId,
  updateRoomById,
  deleteRoomById,
};
