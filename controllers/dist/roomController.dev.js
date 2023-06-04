"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Rooms = require("../models/room");

var _require = require("express-validator"),
    validationResult = _require.validationResult;

var Building = require('../models/building');

var getBuildings = function getBuildings(req, res) {
  var buildings;
  return regeneratorRuntime.async(function getBuildings$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Building.find());

        case 3:
          buildings = _context.sent;
          res.status(200).json({
            status: 'Success',
            message: 'Get buildings successfully!',
            data: "buildings"
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            status: 'Fail',
            message: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var createRoom = function createRoom(req, res) {
  var errors, newRoom;
  return regeneratorRuntime.async(function createRoom$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            status: "Fail",
            message: errors.array()
          }));

        case 4:
          newRoom = new Rooms(_objectSpread({}, req.body, {
            img: req.body.img // Lấy đường dẫn từ trường img của req.body

          })); // Lưu tham chiếu đến đối tượng User tương ứng vào trường users của đối tượng newRoom

          newRoom.users = req.user.id;
          _context2.next = 8;
          return regeneratorRuntime.awrap(newRoom.save());

        case 8:
          res.status(201).json({
            status: "Success",
            message: "Room created successfully!",
            data: {
              room: newRoom
            }
          });
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            status: "Fail",
            message: _context2.t0.message
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var getAllRooms = function getAllRooms(req, res) {
  var rooms;
  return regeneratorRuntime.async(function getAllRooms$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Rooms.find({
            status: true
          }));

        case 3:
          rooms = _context3.sent;
          res.status(200).json({
            status: "Success",
            messages: "Get rooms successfully!",
            data: {
              rooms: rooms
            }
          });
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context3.t0.message
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getRoomsByUserId = function getRoomsByUserId(req, res) {
  var rooms;
  return regeneratorRuntime.async(function getRoomsByUserId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Rooms.find({
            users: req.user._id
          }));

        case 3:
          rooms = _context4.sent;
          res.status(200).json({
            status: "Success",
            messages: "Get rooms successfully!",
            data: {
              rooms: rooms
            }
          });
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context4.t0.message
          });

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var updateRoomById = function updateRoomById(req, res) {
  var updatedRoom;
  return regeneratorRuntime.async(function updateRoomById$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Rooms.findByIdAndUpdate(req.params.id, req.body, {
            "new": true
          }));

        case 3:
          updatedRoom = _context5.sent;
          res.status(200).json({
            status: "Success",
            messages: "Update room successfully!",
            data: {
              room: updatedRoom
            }
          });
          _context5.next = 10;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context5.t0.message
          });

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var deleteRoomById = function deleteRoomById(req, res) {
  var roomId, updatedRoom;
  return regeneratorRuntime.async(function deleteRoomById$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          roomId = req.params.id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(Rooms.findByIdAndUpdate(roomId, {
            status: false
          }, {
            "new": true
          }));

        case 4:
          updatedRoom = _context6.sent;

          if (updatedRoom) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            status: "Fail",
            message: "Room with id ".concat(roomId, " is not found")
          }));

        case 7:
          res.status(200).json({
            status: "Success",
            message: "Room with id ".concat(roomId, " has been deleted successfully"),
            data: {
              room: updatedRoom
            }
          });
          _context6.next = 13;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            status: "Fail",
            message: _context6.t0.message
          });

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = {
  createRoom: createRoom,
  getAllRooms: getAllRooms,
  getRoomsByUserId: getRoomsByUserId,
  updateRoomById: updateRoomById,
  deleteRoomById: deleteRoomById,
  getBuildings: getBuildings
};