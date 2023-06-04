"use strict";

var PostingComments = require('../models/postingComment');

var _require = require("express-validator"),
    validationResult = _require.validationResult;

var createPostingComment = function createPostingComment(req, res) {
  var errors, postComment;
  return regeneratorRuntime.async(function createPostingComment$(_context) {
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
          postComment = new PostingComments({
            description: req.body.description,
            userPostingComment: req.user.id,
            posting: req.body.posting,
            img: req.body.img
          }); // Save the post to the database

          _context.next = 7;
          return regeneratorRuntime.awrap(postComment.save());

        case 7:
          res.status(201).json({
            status: "Success",
            messages: "Post created successfully!",
            data: {
              postComment: postComment
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

var getAllPostingCommentByPost = function getAllPostingCommentByPost(req, res) {
  var postingId, postingComments;
  return regeneratorRuntime.async(function getAllPostingCommentByPost$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          postingId = req.params.id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(PostingComments.find({
            posting: postingId
          }).populate("posting userPostingComment"));

        case 4:
          postingComments = _context2.sent;
          res.status(200).json({
            status: "Success",
            messages: "Get postings successfully!",
            data: {
              postingComments: postingComments
            }
          });
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context2.t0.message
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  createPostingComment: createPostingComment,
  getAllPostingCommentByPost: getAllPostingCommentByPost
};