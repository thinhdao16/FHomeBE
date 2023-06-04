"use strict";

var express = require("express");

var postingCommentController = require("../controllers/postingCommentController");

var authenticate = require("../middlewares/authenticate");

var uploadImage = require("../middlewares/uploadImage");

var router = express.Router();
router.get('/getAllPostingCommentByPost/:id', authenticate, postingCommentController.getAllPostingCommentByPost), router.post('/postAllPostingCommentByPost', authenticate, uploadImage, postingCommentController.createPostingComment);
module.exports = router;