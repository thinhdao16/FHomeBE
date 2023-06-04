"use strict";

var mongoose = require("mongoose");

var roomSchema = new mongoose.Schema({
  roomName: {
    type: String
  },
  size: {
    type: Number,
    min: 0
  },
  price: {
    type: Number,
    min: 0
  },
  description: {
    type: String
  },
  img: {
    type: String
  },
  status: {
    type: Boolean,
    "default": true
  },
  buildings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buildings"
  },
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  }
}, {
  timestamps: true
});
var Rooms = mongoose.model("Rooms", roomSchema);
module.exports = Rooms;