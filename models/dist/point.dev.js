"use strict";

var mongoose = require("mongoose");

var PointSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  },
  point: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});
var Point = mongoose.model("Points", PointSchema);
module.exports = Point;