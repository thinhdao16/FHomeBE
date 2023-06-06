"use strict";

var Point = require("../models/point");

exports.getPoitn = function _callee(req, res) {
  var point;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Point.find({}).populate("user"));

        case 3:
          point = _context.sent;
          res.status(200).json({
            status: "Success",
            messages: "Get favourite successfully!",
            data: {
              point: point
            }
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.createPointUser = function _callee2(req, res) {
  var userId, pointId, existingPoint, point;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.user.id; // Thay "user" bằng tên trường từ form

          pointId = req.body.point; // Thay "point" bằng tên trường từ form

          _context2.next = 5;
          return regeneratorRuntime.awrap(Point.findOne({
            user: userId,
            point: pointId
          }));

        case 5:
          existingPoint = _context2.sent;

          if (!existingPoint) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            status: "Fail",
            messages: "This post has already been pointed by the user"
          }));

        case 8:
          point = new Point({
            user: userId,
            point: pointId
          });
          _context2.next = 11;
          return regeneratorRuntime.awrap(point.save());

        case 11:
          res.status(201).json({
            status: "Success",
            messages: "Point post created successfully!",
            data: {
              point: point
            }
          });
          _context2.next = 17;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context2.t0.message
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

exports.deleteFormPoint = function _callee3(req, res) {
  var point;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Point.findById(req.params.id));

        case 3:
          point = _context3.sent;

          if (point) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Point not found"
          }));

        case 6:
          _context3.next = 8;
          return regeneratorRuntime.awrap(point.remove());

        case 8:
          // Remove the point from the database
          res.status(200).json({
            message: "Point deleted successfully"
          });
          _context3.next = 14;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          res.status(400).json({
            message: _context3.t0.message
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
};