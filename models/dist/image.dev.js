"use strict";

var mongoose = require("mongoose");

var ImageSchema = new mongoose.Schema({
  img: {
    type: String
  },
  imgName: {
    type: String
  }
}, {
  timestamps: true
});
var Image = mongoose.model("Images", ImageSchema);
module.exports = Image;