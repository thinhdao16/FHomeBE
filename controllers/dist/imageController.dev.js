"use strict";

var Images = require("../models/image");

exports.createImages = function _callee(req, res) {
  var newImage;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          newImage = new Images({
            img: req.body.img,
            // Lấy đường dẫn từ trường img của req.body
            imgName: req.body.imgName
          });
          _context.next = 4;
          return regeneratorRuntime.awrap(newImage.save());

        case 4:
          res.status(201).json({
            status: "Success",
            message: "Room created successfully!",
            data: {
              newImage: newImage
            }
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            status: "Fail",
            message: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getAllImages = function _callee2(req, res) {
  var users;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Images.find());

        case 3:
          users = _context2.sent;
          res.status(200).json(users);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: _context2.t0.message
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};