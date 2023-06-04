"use strict";

var _require = require("express-validator"),
    validationResult = _require.validationResult;

var jwt = require("jsonwebtoken");

var serviceAccount = require("../config/serviceAccount.json");

var User = require("../models/user");

var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var checkEmailDomain = function checkEmailDomain(email, listDomain) {
  var domain = email.substring(email.lastIndexOf("@") + 1);
  return listDomain.includes(domain);
};

var createAccessToken = function createAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
};

var login = function login(req, res) {
  var googlePayload, userLogin, payload, accessToken, _payload, _accessToken, newUser;

  return regeneratorRuntime.async(function login$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          googlePayload = jwt.decode(req.body.accessToken, serviceAccount.private_key);
          _context.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: googlePayload.email,
            status: true
          }));

        case 4:
          userLogin = _context.sent;

          if (!userLogin) {
            _context.next = 12;
            break;
          }

          payload = {
            id: userLogin.id,
            fullname: userLogin.fullname,
            email: userLogin.email,
            phoneNumber: userLogin.phoneNumber,
            img: userLogin.img,
            status: userLogin.status,
            roleName: userLogin.roleName
          };
          console.log(payload);
          accessToken = createAccessToken(payload);
          res.status(200).json({
            status: "Success",
            messages: "Login successfully!",
            data: {
              user: payload,
              accessToken: accessToken
            }
          });
          _context.next = 27;
          break;

        case 12:
          if (!checkEmailDomain(googlePayload.email, ["fpt.edu.vn"])) {
            _context.next = 27;
            break;
          }

          register(req, res);

          if (!userLogin) {
            _context.next = 21;
            break;
          }

          _payload = {
            _id: userLogin.id,
            fullname: userLogin.fullname,
            email: userLogin.email,
            phoneNumber: userLogin.phoneNumber,
            img: userLogin.img,
            status: userLogin.status,
            roleName: userLogin.roleName
          };
          console.log(_payload);
          _accessToken = createAccessToken(_payload);
          res.status(200).json({
            status: "Success",
            messages: "Login successfully!",
            data: {
              user: _payload,
              accessToken: _accessToken
            }
          });
          _context.next = 27;
          break;

        case 21:
          debugger;
          newUser = {
            fullname: googlePayload.name || "",
            email: googlePayload.email,
            img: googlePayload.picture,
            phoneNumber: googlePayload.phoneNumber || "",
            status: false
          };
          console.log(googlePayload);
          _context.next = 26;
          return regeneratorRuntime.awrap(User.insertMany(newUser));

        case 26:
          res.status(400).json({
            status: "Fail",
            messages: "Your email domain is not supported. Please contact your administrator to support your account!"
          });

        case 27:
          _context.next = 32;
          break;

        case 29:
          _context.prev = 29;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context.t0.message
          });

        case 32:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 29]]);
};

var register = function register(req, res) {
  var googlePayload, decodeUser, existingUser;
  return regeneratorRuntime.async(function register$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          googlePayload = jwt.decode(req.body.accessToken, process.env.FIREBASE_SECRET);
          decodeUser = {
            fullname: googlePayload.name || " ",
            email: googlePayload.email,
            img: googlePayload.picture,
            phoneNumber: googlePayload.phoneNumber || " ",
            status: true
          };
          _context2.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: decodeUser.email
          }));

        case 5:
          existingUser = _context2.sent;

          if (!existingUser) {
            _context2.next = 10;
            break;
          }

          res.status(400).json({
            status: "Fail",
            messages: "Email already exists"
          });
          _context2.next = 12;
          break;

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(User.insertMany(decodeUser).then(function (user) {
            var payload = {
              fullname: user.fullname,
              email: user.email,
              phoneNumber: user.phoneNumber,
              img: user.img,
              status: user.status,
              roleName: "fptmember"
            };
            var accessToken = createAccessToken(payload);
            res.status(200).json({
              status: "Success",
              messages: "Login successfully!",
              data: {
                user: payload,
                accessToken: accessToken
              }
            });
          }));

        case 12:
          _context2.next = 17;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          res.status(501).json({
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

module.exports = {
  login: login,
  register: register
};