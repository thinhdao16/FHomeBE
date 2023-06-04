"use strict";

var PostingComments = require('../models/postingComment');

var createPosting = function createPosting(req, res) {
  var errors, postComment;
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
  var postingComments;
  return regeneratorRuntime.async(function getAllPostingCommentByPost$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(PostingComments.find({
            userPostingComment: req.user.id
          }).populate("postings "));

        case 3:
          postingComments = _context2.sent;
          res.status(200).json({
            status: "Success",
            messages: "Get postings successfully!",
            data: {
              postingComments: postingComments
            }
          });
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            status: "Fail",
            messages: _context2.t0.message
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = {
  createPosting: createPosting,
  getAllPostingCommentByPost: getAllPostingCommentByPost
};