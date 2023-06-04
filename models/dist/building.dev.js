"use strict";

var mongoose = require("mongoose");

var buildingSchema = new mongoose.Schema({
  buildingName: {
    type: String
  },
  address: {
    type: String
  },
  status: {
    type: Boolean,
    "default": true
  }
}, {
  timestamps: true
});
var Buildings = mongoose.model("Buildings", buildingSchema);
module.exports = Buildings;