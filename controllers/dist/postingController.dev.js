"use strict";

var _require = require("express-validator"),
    validationResult = _require.validationResult;

var Postings = require("../models/posting");

var redis = require("async-redis");

require("dotenv").config();

var paypal = require("../middlewares/paypal");

var Users = require("../models/user");

var sendEmail = require("../utils/sendmail");

var _require2 = require("./pushNotification"),
    sendNotification = _require2.sendNotification; // tạo Redis client instance
// const client = redis.createClient({
//   url: process.env.REDIS_URL,
// });


var createPosting = function createPosting(req, res) {
  var errors, post;
  return regeneratorRuntime.async(function createPosting$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Validate request body
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _context.prev = 3;
          // Create a new post
          post = new Postings({
            title: req.body.title,
            description: req.body.description,
            buildings: req.body.buildings,
            rooms: req.body.rooms,
            userPosting: req.user.id,
            img: req.body.img
          }); // Save the post to the database

          _context.next = 7;
          return regeneratorRuntime.awrap(post.save());

        case 7:
          //delete cache redis
          // const postings = await client.get("postings");
          // if (postings !== null) {
          //   await client.del("postings", (err) => {
          //     if (err) throw err;
          //   });
          // }
          res.status(201).json({
            status: "Success",
            messages: "Post created successfully!",
            data: {
              post: post
            }
          });
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](3);
          res.status(500).json({
            status: "Fail",
            messages: _context.t0.message
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 10]]);
};

var confirmPost = function confirmPost(req, res) {
  var user, hoadon, hoaDonId, posting, updatePost, statusMail, link;
  return regeneratorRuntime.async(function confirmPost$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Users.findById(req.user.id));

        case 2:
          user = _context2.sent;

          if (!(user.phoneNumber.length <= 0)) {
            _context2.next = 6;
            break;
          }

          res.status(500).json({
            message: "Please update your phone number!"
          });
          return _context2.abrupt("return");

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(paypal.createDraftInvoice(user.fullname, user.email, user.phoneNumber));

        case 8:
          hoadon = _context2.sent;
          hoaDonId = hoadon.href.split("/")[6];
          _context2.next = 12;
          return regeneratorRuntime.awrap(Postings.findById(req.params.id).populate("userPosting"));

        case 12:
          posting = _context2.sent;

          if (!posting) {
            res.status(404).json({
              message: "Not found post"
            });
          }

          _context2.prev = 14;

          if (!(posting.status == "approved" || posting.status == "pending" || posting.status == "published")) {
            _context2.next = 18;
            break;
          }

          res.status(200).json({
            message: "Only draft post can do this. Please check again"
          });
          return _context2.abrupt("return");

        case 18:
          posting.status = "published";
          posting.invoiceId = hoaDonId;
          _context2.next = 22;
          return regeneratorRuntime.awrap(posting.save());

        case 22:
          updatePost = _context2.sent;

          if (user.point > 0) {
            user.point -= 1;
          }

          _context2.next = 26;
          return regeneratorRuntime.awrap(user.save());

        case 26:
          statusMail = "confirm";
          link = "";
          _context2.next = 30;
          return regeneratorRuntime.awrap(sendEmail(statusMail, posting, link));

        case 30:
          sendNotification();
          res.status(200).json({
            message: "Update successful, Please wait for admin to approve",
            data: {
              post: updatePost,
              user: user
            }
          });
          _context2.next = 37;
          break;

        case 34:
          _context2.prev = 34;
          _context2.t0 = _context2["catch"](14);
          res.status(500).json({
            message: "Something went wrong",
            error: _context2.t0.message
          });

        case 37:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[14, 34]]);
};

var approvedPost = function approvedPost(req, res) {
  var posting, invoiceId, link, updatePost, statusMail;
  return regeneratorRuntime.async(function approvedPost$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Postings.findById(req.params.id).populate("userPosting"));

        case 3:
          posting = _context3.sent;

          if (!posting) {
            res.status(404).json({
              message: "Not found post"
            });
          }

          invoiceId = posting.invoiceId;
          _context3.next = 8;
          return regeneratorRuntime.awrap(paypal.changeInvoiceStatusToUNPAID(invoiceId));

        case 8:
          link = _context3.sent;

          // console.log("link :",link);
          if (posting.status != "pending") {
            res.status(200).json({
              message: "Only pending post can do this. Please check again"
            });
          }

          posting.status = "approved";
          _context3.next = 13;
          return regeneratorRuntime.awrap(posting.save());

        case 13:
          updatePost = _context3.sent;
          statusMail = "approved";
          _context3.next = 17;
          return regeneratorRuntime.awrap(sendEmail(statusMail, posting, link));

        case 17:
          res.status(200).json({
            message: "update successfully",
            data: updatePost,
            link: link
          });
          _context3.next = 23;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: "Something went wrong",
            error: _context3.t0.message
          });

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

var getAllPostings = function getAllPostings(req, res) {
  var listpost, postings;
  return regeneratorRuntime.async(function getAllPostings$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Postings.find({
            status: "approved"
          }));

        case 3:
          listpost = _context5.sent;
          listpost.forEach(function _callee(post) {
            var hoadon;
            return regeneratorRuntime.async(function _callee$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return regeneratorRuntime.awrap(paypal.getInvoiceDetail(post.invoiceId));

                  case 2:
                    hoadon = _context4.sent;

                    if (hoadon.status === "PAID") {
                      post.status = "published";
                      post.save();
                    }

                  case 4:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          });
          _context5.next = 7;
          return regeneratorRuntime.awrap(Postings.find({
            status: "published"
          }));

        case 7:
          postings = _context5.sent;
          res.status(200).json({
            status: "Success",
            messages: "Get posts successfully from database!",
            data: {
              postings: postings
            }
          }); // }

          _context5.next = 14;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context5.t0.message
          });

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var getPostingDraft = function getPostingDraft(req, res) {
  var postings;
  return regeneratorRuntime.async(function getPostingDraft$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Postings.find({
            status: "draft"
          }).populate("userPosting"));

        case 3:
          postings = _context6.sent;
          // Save the fetched data to Redis cache
          // client.set("postings", JSON.stringify(postings));
          res.status(200).json({
            status: "Success",
            data: {
              postings: postings
            }
          }); // }

          _context6.next = 10;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context6.t0.message
          });

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getPostingPending = function getPostingPending(req, res) {
  var postings;
  return regeneratorRuntime.async(function getPostingPending$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Postings.find({
            status: "pending"
          }).populate("userPosting"));

        case 3:
          postings = _context7.sent;
          res.status(200).json({
            status: "Success",
            data: {
              postings: postings
            }
          }); // }

          _context7.next = 10;
          break;

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context7.t0.message
          });

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getPostingApproved = function getPostingApproved(req, res) {
  var postings;
  return regeneratorRuntime.async(function getPostingApproved$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(Postings.find({
            status: "approved"
          }).populate("userPosting"));

        case 3:
          postings = _context8.sent;
          res.status(200).json({
            status: "Success",
            data: {
              postings: postings
            }
          }); // }

          _context8.next = 10;
          break;

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context8.t0
          });

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getPostingRejected = function getPostingRejected(req, res) {
  var postings;
  return regeneratorRuntime.async(function getPostingRejected$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(Postings.find({
            status: "rejected"
          }).populate("userPosting"));

        case 3:
          postings = _context9.sent;
          res.status(200).json({
            status: "Success",
            data: {
              postings: postings
            }
          }); // }

          _context9.next = 10;
          break;

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context9.t0.message
          });

        case 10:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getAllStatus = function getAllStatus(req, res) {
  var postings;
  return regeneratorRuntime.async(function getAllStatus$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(paypal.checkPublishedPost());

        case 3:
          _context10.next = 5;
          return regeneratorRuntime.awrap(Postings.find().populate("userPosting buildings rooms"));

        case 5:
          postings = _context10.sent;
          res.status(200).json({
            status: "Success",
            data: {
              postings: postings
            }
          }); // }

          _context10.next = 12;
          break;

        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context10.t0.message
          });

        case 12:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getUserPosts = function getUserPosts(req, res) {
  var postings;
  return regeneratorRuntime.async(function getUserPosts$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(Postings.find({
            userPosting: req.user.id
          }).populate("buildings rooms userPosting"));

        case 3:
          postings = _context11.sent;
          res.status(200).json({
            status: "Success",
            messages: "Get postings successfully!",
            data: {
              postings: postings
            }
          });
          _context11.next = 10;
          break;

        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context11.t0.message
          });

        case 10:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getPostingById = function getPostingById(req, res) {
  var posting;
  return regeneratorRuntime.async(function getPostingById$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(Postings.findById(req.params.id));

        case 3:
          posting = _context12.sent;

          if (!posting) {
            res.status(404).json({
              message: "posting not found"
            });
          }

          res.status(200).json({
            status: "Success",
            messages: "Get post successfully!",
            data: {
              posting: posting
            }
          });
          _context12.next = 11;
          break;

        case 8:
          _context12.prev = 8;
          _context12.t0 = _context12["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context12.t0.message
          });

        case 11:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var updatePosting = function updatePosting(req, res) {
  var posting, updatedPosting;
  return regeneratorRuntime.async(function updatePosting$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return regeneratorRuntime.awrap(Postings.findById(req.params.id));

        case 3:
          posting = _context13.sent;

          if (posting) {
            _context13.next = 6;
            break;
          }

          return _context13.abrupt("return", res.status(404).json({
            message: "Post not found"
          }));

        case 6:
          if (req.body.title) {
            posting.title = req.body.title;
          }

          if (req.body.description) {
            posting.description = req.body.description;
          }

          if (req.body.buildings) {
            posting.buildings = req.body.buildings;
          }

          if (req.body.roomTypes) {
            posting.roomTypes = req.body.roomTypes;
          }

          if (req.body.userPosting) {
            posting.userPosting = req.user.id;
          }

          if (req.body.img) {
            posting.img = req.body.img;
          }

          _context13.next = 14;
          return regeneratorRuntime.awrap(posting.save());

        case 14:
          updatedPosting = _context13.sent;
          res.status(200).json({
            message: "update success",
            data: updatedPosting
          });
          _context13.next = 21;
          break;

        case 18:
          _context13.prev = 18;
          _context13.t0 = _context13["catch"](0);
          res.status(400).json({
            message: _context13.t0.message
          });

        case 21:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var rejectPost = function rejectPost(req, res) {
  var posting, hoadonId, updatedPosting, statusMail, link;
  return regeneratorRuntime.async(function rejectPost$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _context14.next = 3;
          return regeneratorRuntime.awrap(Postings.findById(req.params.id).populate("userPosting"));

        case 3:
          posting = _context14.sent;

          if (posting) {
            _context14.next = 6;
            break;
          }

          return _context14.abrupt("return", res.status(404).json({
            message: "Post not found"
          }));

        case 6:
          hoadonId = posting.invoiceId;
          _context14.next = 9;
          return regeneratorRuntime.awrap(paypal.deleteInvoice(hoadonId));

        case 9:
          posting.status = "rejected";
          _context14.next = 12;
          return regeneratorRuntime.awrap(posting.save());

        case 12:
          updatedPosting = _context14.sent;
          statusMail = "rejected";
          link = "";
          _context14.next = 17;
          return regeneratorRuntime.awrap(sendEmail(statusMail, posting, link));

        case 17:
          res.status(200).json(updatedPosting);
          _context14.next = 23;
          break;

        case 20:
          _context14.prev = 20;
          _context14.t0 = _context14["catch"](0);
          res.status(400).json({
            message: _context14.t0.message
          });

        case 23:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

var deletePost = function deletePost(req, res, next) {
  var post, hoadonId;
  return regeneratorRuntime.async(function deletePost$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _context15.next = 3;
          return regeneratorRuntime.awrap(Postings.findById(req.params.id));

        case 3:
          post = _context15.sent;

          if (post) {
            _context15.next = 8;
            break;
          }

          res.status(404).json({
            message: "No posts found"
          });
          _context15.next = 14;
          break;

        case 8:
          hoadonId = post.invoiceId;
          _context15.next = 11;
          return regeneratorRuntime.awrap(paypal.deleteInvoice(hoadonId));

        case 11:
          _context15.next = 13;
          return regeneratorRuntime.awrap(post.remove());

        case 13:
          res.status(200).json({
            message: "delete post success"
          });

        case 14:
          _context15.next = 19;
          break;

        case 16:
          _context15.prev = 16;
          _context15.t0 = _context15["catch"](0);
          res.status(500).json({
            error: _context15.t0
          });

        case 19:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var countPosts = function countPosts(req, res, next) {
  var _req$query, year, month, day, status, startOfYear, endOfYear, query, count, startOfMonth, endOfMonth, _query, _count, startOfDay, endOfDay, _query2, _count2;

  return regeneratorRuntime.async(function countPosts$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _req$query = req.query, year = _req$query.year, month = _req$query.month, day = _req$query.day, status = _req$query.status;

          if (!year) {
            year = new Date().getFullYear();
          } // If month is not provided, count for the entire year


          if (month) {
            _context16.next = 19;
            break;
          }

          startOfYear = new Date(year, 0, 1);
          endOfYear = new Date(year, 11, 31);
          endOfYear.setHours(23, 59, 59, 999);
          query = {
            createdAt: {
              $gte: startOfYear,
              $lte: endOfYear
            }
          };

          if (status) {
            query.status = status;
          }

          _context16.prev = 8;
          _context16.next = 11;
          return regeneratorRuntime.awrap(Postings.countDocuments(query));

        case 11:
          count = _context16.sent;
          res.status(200).json({
            count: count
          });
          _context16.next = 19;
          break;

        case 15:
          _context16.prev = 15;
          _context16.t0 = _context16["catch"](8);
          console.log(_context16.t0);
          res.status(500).json({
            message: "Server Error"
          });

        case 19:
          if (!(month && !day)) {
            _context16.next = 36;
            break;
          }

          startOfMonth = new Date(year, month - 1, 1);
          endOfMonth = new Date(year, month, 0);
          endOfMonth.setHours(23, 59, 59, 999);
          _query = {
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth
            }
          };

          if (status) {
            _query.status = status;
          }

          _context16.prev = 25;
          _context16.next = 28;
          return regeneratorRuntime.awrap(Postings.countDocuments(_query));

        case 28:
          _count = _context16.sent;
          res.status(200).json({
            count: _count
          });
          _context16.next = 36;
          break;

        case 32:
          _context16.prev = 32;
          _context16.t1 = _context16["catch"](25);
          console.log(_context16.t1);
          res.status(500).json({
            message: "Server Error"
          });

        case 36:
          if (!(month && day)) {
            _context16.next = 53;
            break;
          }

          startOfDay = new Date(year, month - 1, day);
          endOfDay = new Date(year, month - 1, day);
          endOfDay.setHours(23, 59, 59, 999);
          _query2 = {
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay
            }
          };

          if (status) {
            _query2.status = status;
          }

          _context16.prev = 42;
          _context16.next = 45;
          return regeneratorRuntime.awrap(Postings.countDocuments(_query2));

        case 45:
          _count2 = _context16.sent;
          res.status(200).json({
            count: _count2
          });
          _context16.next = 53;
          break;

        case 49:
          _context16.prev = 49;
          _context16.t2 = _context16["catch"](42);
          console.log(_context16.t2);
          res.status(500).json({
            message: "Server Error"
          });

        case 53:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[8, 15], [25, 32], [42, 49]]);
};

var countPostsByMonth = function countPostsByMonth(req, res, next) {
  var year, month, status, startOfMonth, endOfMonth, query, count;
  return regeneratorRuntime.async(function countPostsByMonth$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          year = parseInt(req.query.year);
          month = parseInt(req.query.month);
          status = req.query.status;
          startOfMonth = new Date(year, month - 1, 1);
          endOfMonth = new Date(year, month, 0);
          endOfMonth.setHours(23, 59, 59, 999);
          query = {
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth
            }
          };

          if (status) {
            // Nếu status được truyền vào
            query.status = status; // Thêm điều kiện lọc theo status
          }

          _context17.prev = 8;
          _context17.next = 11;
          return regeneratorRuntime.awrap(Postings.countDocuments(query));

        case 11:
          count = _context17.sent;
          res.status(200).json({
            count: count
          });
          _context17.next = 19;
          break;

        case 15:
          _context17.prev = 15;
          _context17.t0 = _context17["catch"](8);
          console.log(_context17.t0);
          res.status(500).json({
            message: "Server Error"
          });

        case 19:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[8, 15]]);
};

var countPostsByYear = function countPostsByYear(req, res, next) {
  var year, status, startOfYear, endOfYear, query, count;
  return regeneratorRuntime.async(function countPostsByYear$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          year = parseInt(req.query.year);
          status = req.query.status;
          startOfYear = new Date(year, 0, 1);
          endOfYear = new Date(year, 11, 31);
          endOfYear.setHours(23, 59, 59, 999);
          query = {
            createdAt: {
              $gte: startOfYear,
              $lte: endOfYear
            }
          };

          if (status) {
            // Nếu status được truyền vào
            query.status = status; // Thêm điều kiện lọc theo status
          }

          _context18.prev = 7;
          _context18.next = 10;
          return regeneratorRuntime.awrap(Postings.countDocuments(query));

        case 10:
          count = _context18.sent;
          res.status(200).json({
            count: count
          });
          _context18.next = 18;
          break;

        case 14:
          _context18.prev = 14;
          _context18.t0 = _context18["catch"](7);
          console.log(_context18.t0);
          res.status(500).json({
            message: "Server Error"
          });

        case 18:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[7, 14]]);
};

var countPostsToday = function countPostsToday(req, res, next) {
  var today, status, query, count;
  return regeneratorRuntime.async(function countPostsToday$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          today = new Date();
          today.setHours(0, 0, 0, 0);
          status = req.query.status; // Lấy giá trị của tham số status từ query string

          query = {
            createdAt: {
              $gte: today
            }
          };

          if (status) {
            // Nếu status được truyền vào
            query.status = status; // Thêm điều kiện lọc theo status
          }

          _context19.prev = 5;
          _context19.next = 8;
          return regeneratorRuntime.awrap(Postings.countDocuments(query));

        case 8:
          count = _context19.sent;
          res.status(200).json({
            count: count
          });
          _context19.next = 16;
          break;

        case 12:
          _context19.prev = 12;
          _context19.t0 = _context19["catch"](5);
          console.log(_context19.t0);
          res.status(500).json({
            message: "Server Error"
          });

        case 16:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[5, 12]]);
};

var setPosting = function setPosting(req, res) {
  var postingId, updatedPosting;
  return regeneratorRuntime.async(function setPosting$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          postingId = req.params.id;
          _context20.next = 4;
          return regeneratorRuntime.awrap(Postings.findByIdAndUpdate(postingId, {
            status: "approved"
          }, {
            "new": true
          }));

        case 4:
          updatedPosting = _context20.sent;

          if (!(!updatedPosting || updatedPosting.status !== "approved")) {
            _context20.next = 7;
            break;
          }

          return _context20.abrupt("return", res.status(404).json({
            status: "Fail",
            message: "Posting not found or status is not 'approved'"
          }));

        case 7:
          res.status(200).json({
            status: "Success",
            message: "Posting status updated to 'approved' successfully!",
            data: {
              posting: updatedPosting
            }
          });
          _context20.next = 13;
          break;

        case 10:
          _context20.prev = 10;
          _context20.t0 = _context20["catch"](0);
          res.status(500).json({
            status: "Fail",
            message: _context20.t0.message
          });

        case 13:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var setPostingPublished = function setPostingPublished(req, res) {
  var postingId, updatedPosting;
  return regeneratorRuntime.async(function setPostingPublished$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          postingId = req.params.id;
          _context21.next = 4;
          return regeneratorRuntime.awrap(Postings.findByIdAndUpdate(postingId, {
            status: "published"
          }, {
            "new": true
          }));

        case 4:
          updatedPosting = _context21.sent;

          if (!(!updatedPosting || updatedPosting.status !== "published")) {
            _context21.next = 7;
            break;
          }

          return _context21.abrupt("return", res.status(404).json({
            status: "Fail",
            message: "Posting not found or status is not 'published'"
          }));

        case 7:
          res.status(200).json({
            status: "Success",
            message: "Posting status updated to 'approved' successfully!",
            data: {
              posting: updatedPosting
            }
          });
          _context21.next = 13;
          break;

        case 10:
          _context21.prev = 10;
          _context21.t0 = _context21["catch"](0);
          res.status(500).json({
            status: "Fail",
            message: _context21.t0.message
          });

        case 13:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = {
  createPosting: createPosting,
  getAllPostings: getAllPostings,
  getPostingById: getPostingById,
  updatePosting: updatePosting,
  rejectPost: rejectPost,
  getUserPosts: getUserPosts,
  confirmPost: confirmPost,
  approvedPost: approvedPost,
  getPostingDraft: getPostingDraft,
  getPostingPending: getPostingPending,
  getPostingApproved: getPostingApproved,
  getPostingRejected: getPostingRejected,
  getAllStatus: getAllStatus,
  deletePost: deletePost,
  countPostsByMonth: countPostsByMonth,
  countPostsToday: countPostsToday,
  countPostsByYear: countPostsByYear,
  countPosts: countPosts,
  //
  setPosting: setPosting,
  setPostingPublished: setPostingPublished
};