const express = require("express");
const postingCommentController = require("../controllers/postingCommentController");
const authenticate = require("../middlewares/authenticate");
const uploadImage = require("../middlewares/uploadImage");
const router = express.Router();

router.get(
  "/getAllPostingCommentByPost/:id",
  authenticate,
  postingCommentController.getAllPostingCommentByPost
),
  router.post(
    "/postAllPostingCommentByPost",
    authenticate,
    uploadImage,
    postingCommentController.createPostingComment
  );

router.get(
  "/allComment",
  authenticate,
  postingCommentController.getAllPostingComment
);
module.exports = router;
