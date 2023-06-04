"use strict";

var mongoose = require("mongoose");

var postCommentSchema = new mongoose.Schema({
  description: {
    type: String
  },
  status: {
    type: Boolean,
    "default": true
  },
  userPostingComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  },
  posting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Postings"
  },
  img: {
    type: String
  }
}, {
  timestamps: true
});
var PostingComments = mongoose.model("PostingComments", postCommentSchema);
module.exports = PostingComments;