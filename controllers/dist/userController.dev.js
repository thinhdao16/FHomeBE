"use strict";

var _require = require("mongoose"),
    mongoose = _require["default"];

var Point = require("../models/point");

var User = require("../models/user");

var sendEmail = require("../utils/sendmail"); // Lấy thông tin tất cả người dùng


exports.getAllUsers = function _callee(req, res) {
  var users;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.find());

        case 3:
          users = _context.sent;
          res.status(200).json(users);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Lấy thông tin người dùng theo ID


exports.getUserById = function _callee2(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.id));

        case 3:
          user = _context2.sent;

          if (user) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 6:
          res.status(200).json(user);
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: _context2.t0.message
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Tạo người dùng mới


exports.createUser = function _callee3(req, res) {
  var user, newUser;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          user = new User({
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            fullname: req.body.fullname,
            img: req.body.img,
            roleName: req.body.roleName
          });
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(user.save());

        case 4:
          newUser = _context3.sent;
          res.status(201).json(newUser);
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          res.status(400).json({
            message: _context3.t0.message
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
}; // Cập nhật thông tin người dùng


exports.updateUser = function _callee4(req, res) {
  var user, updatedUser;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.id));

        case 3:
          user = _context4.sent;

          if (user) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 6:
          if (req.body.email) {
            user.email = req.body.email;
          }

          if (req.body.password) {
            user.password = req.body.password;
          }

          if (req.body.phoneNumber) {
            user.phoneNumber = req.body.phoneNumber;
          }

          if (req.body.fullname) {
            user.fullname = req.body.fullname;
          }

          if (req.body.img) {
            user.img = req.body.img;
          }

          if (req.body.roleName) {
            user.roleName = req.body.roleName;
          }

          _context4.next = 14;
          return regeneratorRuntime.awrap(user.save());

        case 14:
          updatedUser = _context4.sent;
          res.status(200).json(updatedUser);
          _context4.next = 21;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](0);
          res.status(400).json({
            message: _context4.t0.message
          });

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 18]]);
}; //thêm điểm cho người dùng


exports.updatePointUser = function _callee5(req, res) {
  var userId, user, pointsToAdd, pointId, point, updatedUser;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = req.params.id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 4:
          user = _context5.sent;

          if (user) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 7:
          if (req.body.point) {
            pointsToAdd = parseInt(req.body.point);
            user.point += pointsToAdd;
          }

          pointId = req.body.pointId; // Lấy ID của "point" từ body của yêu cầu

          if (!pointId) {
            _context5.next = 18;
            break;
          }

          _context5.next = 12;
          return regeneratorRuntime.awrap(Point.findById(pointId));

        case 12:
          point = _context5.sent;

          if (point) {
            _context5.next = 15;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "Point not found"
          }));

        case 15:
          point.status = "approved";
          _context5.next = 18;
          return regeneratorRuntime.awrap(point.save());

        case 18:
          _context5.next = 20;
          return regeneratorRuntime.awrap(user.save());

        case 20:
          updatedUser = _context5.sent;
          res.status(200).json(updatedUser);
          _context5.next = 27;
          break;

        case 24:
          _context5.prev = 24;
          _context5.t0 = _context5["catch"](0);
          res.status(400).json({
            message: _context5.t0.message
          });

        case 27:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 24]]);
}; //gửi điểm để admin xác nhận 


exports.createFromPoint = function _callee6(req, res) {
  var errors, post;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          // Validate request body
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context6.next = 3;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _context6.prev = 3;
          post = new Postings({
            title: req.body.title,
            description: req.body.description,
            buildings: req.body.buildings,
            rooms: req.body.rooms,
            userPosting: req.user.id,
            img: req.body.img
          });
          _context6.next = 7;
          return regeneratorRuntime.awrap(post.save());

        case 7:
          res.status(201).json({
            status: "Success",
            messages: "Post created successfully!",
            data: {
              post: post
            }
          });
          _context6.next = 13;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](3);
          res.status(500).json({
            status: "Fail",
            messages: _context6.t0.message
          });

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[3, 10]]);
}; // Xoá người dùng


exports.deleteUser = function _callee7(req, res) {
  var user, updatedUser;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.id));

        case 3:
          user = _context7.sent;

          if (user) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 6:
          user.status = false;
          _context7.next = 9;
          return regeneratorRuntime.awrap(user.save());

        case 9:
          updatedUser = _context7.sent;
          res.status(200).json(updatedUser);
          _context7.next = 16;
          break;

        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](0);
          res.status(400).json({
            message: _context7.t0.message
          });

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; //get data theo status false


exports.getData = function _callee8(req, res) {
  var users;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(User.find({
            status: false
          }));

        case 3:
          users = _context8.sent;
          res.status(200).json({
            status: "Success",
            messages: "Get users successfully!",
            data: {
              users: users
            }
          });
          _context8.next = 10;
          break;

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context8.t0.message
          });

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //set status user thành true


exports.setUserStatus = function _callee9(req, res) {
  var userId, updatedUser;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          userId = req.params.id;
          _context9.next = 4;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate( // { id: userId },
          mongoose.Types.ObjectId(userId), {
            status: true,
            roleName: "landlord"
          }, {
            "new": true
          } // trả về user sau khi đã update
          ));

        case 4:
          updatedUser = _context9.sent;

          if (!(!updatedUser || !updatedUser.status)) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            status: "Fail",
            messages: "User not found or status is not true"
          }));

        case 7:
          // const statusMail = "registerSuccess";
          // await sendEmail(statusMail, updatedUser)
          res.status(200).json({
            status: "Success",
            messages: "User status updated successfully!",
            data: {
              user: updatedUser
            }
          });
          _context9.next = 13;
          break;

        case 10:
          _context9.prev = 10;
          _context9.t0 = _context9["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context9.t0.message
          });

        case 13:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; //delete User theo id


exports.deleteUser = function _callee10(req, res) {
  var userId, deletedUser;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          userId = req.params.id;
          _context10.next = 4;
          return regeneratorRuntime.awrap(User.findByIdAndDelete(userId));

        case 4:
          deletedUser = _context10.sent;

          if (deletedUser) {
            _context10.next = 7;
            break;
          }

          return _context10.abrupt("return", res.status(404).json({
            status: "Fail",
            messages: "User not found"
          }));

        case 7:
          res.status(200).json({
            status: "Success",
            messages: "User deleted successfully!",
            data: {// user: deletedUser,
            }
          });
          _context10.next = 13;
          break;

        case 10:
          _context10.prev = 10;
          _context10.t0 = _context10["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context10.t0.message
          });

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.countUsers = function _callee11(req, res, next) {
  var year, month, day, status, startOfDay, endOfDay, query, count;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          year = parseInt(req.query.year);
          month = parseInt(req.query.month) - 1; // Trừ đi 1 vì tháng trong JS bắt đầu từ 0

          day = parseInt(req.query.day);
          status = req.query.status;

          if (year && month && day) {
            // Nếu truyền vào ngày
            startOfDay = new Date(year, month, day);
            endOfDay = new Date(year, month, day);
            endOfDay.setHours(23, 59, 59, 999);
          } else if (year && month) {
            // Nếu truyền vào tháng
            startOfDay = new Date(year, month, 1);
            endOfDay = new Date(year, month + 1, 0);
            endOfDay.setHours(23, 59, 59, 999);
          } else if (year) {
            // Nếu truyền vào năm
            startOfDay = new Date(year, 0, 1);
            endOfDay = new Date(year, 11, 31);
            endOfDay.setHours(23, 59, 59, 999);
          }

          query = {
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay
            }
          };

          if (status) {
            // Nếu status được truyền vào
            query.status = status; // Thêm điều kiện lọc theo status
          }

          _context11.prev = 7;
          _context11.next = 10;
          return regeneratorRuntime.awrap(User.countDocuments(query));

        case 10:
          count = _context11.sent;
          res.status(200).json({
            count: count
          });
          _context11.next = 18;
          break;

        case 14:
          _context11.prev = 14;
          _context11.t0 = _context11["catch"](7);
          console.log(_context11.t0);
          res.status(500).json({
            message: 'Server Error'
          });

        case 18:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[7, 14]]);
};