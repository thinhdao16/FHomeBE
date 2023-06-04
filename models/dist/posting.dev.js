"use strict";

var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
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
  rooms: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rooms"
  },
  userPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  },
  img: {
    type: String
  }
}, {
  timestamps: true
});
var Postings = mongoose.model("Postings", postSchema);
module.exports = Postings;