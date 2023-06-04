"use strict";

var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    "default": "N/A"
  },
  fullname: {
    type: String
  },
  img: {
    type: String
  },
  status: {
    type: Boolean,
    "default": true
  },
  roleName: {
    type: String,
    "enum": ["admin", "landlord", "fptmember"]
  },
  point: {
    type: Number,
    "default": 0
  }
}, {
  timestamps: true
});
var Users = mongoose.model("Users", userSchema);
module.exports = Users;